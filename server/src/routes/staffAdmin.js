import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../prismaClient.js'
import { requireAdmin } from '../auth.js'
import { logAudit } from '../audit.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from '../supabaseAdmin.js'
import {
  DATE_PATTERN, MONTH_PATTERN, generateTempPassword, monthRange, profileCompleteness,
  serializePayout, serializeStaff, serializeWorkLog,
} from '../staffConstants.js'

const router = Router()
router.use(requireAdmin)

const PAYMENT_MODES = ['cash', 'upi', 'bank_transfer', 'cheque', 'card']
const MAX_HOURLY_RATE = 100000

const clean = (value, max = 200) => {
  const s = String(value ?? '').trim().slice(0, max)
  return s || null
}

function validateStaffBody(body) {
  const name = clean(body.name, 120)
  const phone = clean(body.phone, 20)
  const email = clean(body.email, 120)
  const hourlyRate = Number(body.hourlyRate)

  if (!name) return { error: 'Name is required.' }
  if (phone && !/^[6-9]\d{9}$/.test(phone)) return { error: 'Enter a valid 10-digit mobile number.' }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' }
  if (!Number.isInteger(hourlyRate) || hourlyRate < 1 || hourlyRate > MAX_HOURLY_RATE) {
    return { error: 'Hourly rate must be a whole number of rupees greater than 0.' }
  }
  return { data: { name, phone, email, hourlyRate } }
}

async function nextStaffCode() {
  const last = await prisma.staff.findFirst({ orderBy: { staffCode: 'desc' }, select: { staffCode: true } })
  const n = last ? Number(last.staffCode.replace(/\D/g, '')) + 1 : 1
  return `STF-${String(n).padStart(4, '0')}`
}


router.get('/', async (req, res) => {
  try {
    const [staff, documents, logTotals] = await Promise.all([
      prisma.staff.findMany({ orderBy: { staffCode: 'asc' } }),
      prisma.staffDocument.findMany({ select: { staffId: true, kind: true } }),
      prisma.staffWorkLog.groupBy({
        by: ['staffId', 'status'],
        where: { OR: [{ status: 'pending' }, { status: 'approved', payoutId: null }] },
        _sum: { minutes: true, amount: true },
        _count: true,
      }),
    ])

    const docsByStaff = Object.groupBy ? Object.groupBy(documents, (d) => d.staffId) : documents.reduce((acc, d) => {
      (acc[d.staffId] ||= []).push(d)
      return acc
    }, {})

    res.json(staff.map((s) => {
      const pending = logTotals.find((t) => t.staffId === s.id && t.status === 'pending')
      const unpaid = logTotals.find((t) => t.staffId === s.id && t.status === 'approved')
      return {
        ...serializeStaff(s),
        completeness: profileCompleteness(s, docsByStaff[s.id] || []).percent,
        pendingCount: pending?._count || 0,
        pendingMinutes: pending?._sum.minutes || 0,
        unpaidMinutes: unpaid?._sum.minutes || 0,
        unpaidAmount: unpaid?._sum.amount || 0,
      }
    }))
  } catch (err) {
    console.error('Failed to list staff:', err)
    res.status(500).json({ error: 'Failed to load staff.' })
  }
})

router.post('/', async (req, res) => {
  const { data, error } = validateStaffBody(req.body)
  if (error) return res.status(400).json({ error })

  const tempPassword = generateTempPassword()
  try {
    const passwordHash = await bcrypt.hash(tempPassword, 10)
    let staff
    for (let attempt = 0; attempt < 2 && !staff; attempt++) {
      try {
        staff = await prisma.staff.create({
          data: { ...data, staffCode: await nextStaffCode(), passwordHash, createdByEmail: req.admin.email },
        })
      } catch (err) {
        if (err.code !== 'P2002' || attempt === 1) throw err
      }
    }
    await logAudit({ adminEmail: req.admin.email, action: 'STAFF_CREATED', newValue: { staffId: staff.id, staffCode: staff.staffCode, name: staff.name, hourlyRate: staff.hourlyRate } })
    res.status(201).json({ staff: serializeStaff(staff), tempPassword })
  } catch (err) {
    console.error('Failed to create staff:', err)
    res.status(500).json({ error: 'Failed to create staff member.' })
  }
})


router.get('/work-logs/pending', async (req, res) => {
  try {
    const logs = await prisma.staffWorkLog.findMany({
      where: { status: 'pending' },
      orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
      include: { staff: { select: { id: true, name: true, staffCode: true, hourlyRate: true } } },
    })
    res.json(logs.map(serializeWorkLog))
  } catch (err) {
    console.error('Failed to list pending work logs:', err)
    res.status(500).json({ error: 'Failed to load pending hours.' })
  }
})

router.patch('/work-logs/:logId', async (req, res) => {
  const status = req.body.status
  const rejectionReason = clean(req.body.rejectionReason, 300)
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'status must be approved or rejected.' })
  if (status === 'rejected' && !rejectionReason) return res.status(400).json({ error: 'Give a reason for rejecting.' })

  try {
    const log = await prisma.staffWorkLog.findUnique({ where: { id: req.params.logId }, include: { staff: true } })
    if (!log) return res.status(404).json({ error: 'Entry not found.' })
    if (log.payoutId) return res.status(409).json({ error: 'This entry has already been paid and cannot be changed.' })

    const rate = log.staff.hourlyRate
    const updated = await prisma.staffWorkLog.update({
      where: { id: log.id },
      data: status === 'approved'
        ? { status, hourlyRate: rate, amount: Math.round((rate * log.minutes) / 60), rejectionReason: null, reviewedByEmail: req.admin.email, reviewedAt: new Date() }
        : { status, hourlyRate: null, amount: null, rejectionReason, reviewedByEmail: req.admin.email, reviewedAt: new Date() },
    })
    await logAudit({
      adminEmail: req.admin.email,
      action: status === 'approved' ? 'STAFF_HOURS_APPROVED' : 'STAFF_HOURS_REJECTED',
      oldStatus: log.status,
      newStatus: status,
      newValue: { workLogId: log.id, staffCode: log.staff.staffCode, minutes: log.minutes, amount: updated.amount },
      remarks: rejectionReason,
    })
    res.json(serializeWorkLog(updated))
  } catch (err) {
    console.error('Failed to review work log:', err)
    res.status(500).json({ error: 'Failed to update the entry.' })
  }
})


async function loadStaff(req, res) {
  const staff = await prisma.staff.findUnique({ where: { id: req.params.id } })
  if (!staff) res.status(404).json({ error: 'Staff member not found.' })
  return staff
}

router.get('/:id', async (req, res) => {
  try {
    const staff = await loadStaff(req, res)
    if (!staff) return
    const documents = await prisma.staffDocument.findMany({ where: { staffId: staff.id }, orderBy: { createdAt: 'asc' } })
    res.json({ ...serializeStaff(staff), documents, completeness: profileCompleteness(staff, documents) })
  } catch (err) {
    console.error('Failed to load staff member:', err)
    res.status(500).json({ error: 'Failed to load staff member.' })
  }
})

router.patch('/:id', async (req, res) => {
  const { data, error } = validateStaffBody(req.body)
  if (error) return res.status(400).json({ error })
  const active = req.body.active === undefined ? undefined : Boolean(req.body.active)

  try {
    const existing = await loadStaff(req, res)
    if (!existing) return
    const staff = await prisma.staff.update({ where: { id: existing.id }, data: { ...data, ...(active === undefined ? {} : { active }) } })
    await logAudit({
      adminEmail: req.admin.email,
      action: 'STAFF_UPDATED',
      oldValue: { name: existing.name, hourlyRate: existing.hourlyRate, active: existing.active },
      newValue: { staffId: staff.id, name: staff.name, hourlyRate: staff.hourlyRate, active: staff.active },
    })
    res.json(serializeStaff(staff))
  } catch (err) {
    console.error('Failed to update staff member:', err)
    res.status(500).json({ error: 'Failed to update staff member.' })
  }
})

router.post('/:id/reset-password', async (req, res) => {
  try {
    const existing = await loadStaff(req, res)
    if (!existing) return
    const tempPassword = generateTempPassword()
    await prisma.staff.update({
      where: { id: existing.id },
      data: { passwordHash: await bcrypt.hash(tempPassword, 10), mustChangePassword: true, sessionVersion: { increment: 1 } },
    })
    await logAudit({ adminEmail: req.admin.email, action: 'STAFF_PASSWORD_RESET', newValue: { staffId: existing.id, staffCode: existing.staffCode } })
    res.json({ staffCode: existing.staffCode, tempPassword })
  } catch (err) {
    console.error('Failed to reset staff password:', err)
    res.status(500).json({ error: 'Failed to reset the password.' })
  }
})

router.get('/:id/documents/:docId/signed-url', async (req, res) => {
  try {
    const document = await prisma.staffDocument.findFirst({ where: { id: req.params.docId, staffId: req.params.id } })
    if (!document) return res.status(404).json({ error: 'Document not found.' })
    const { data, error } = await getSupabaseAdmin().storage.from(STORAGE_BUCKET).createSignedUrl(document.path, 10 * 60)
    if (error) throw error
    res.json({ url: data.signedUrl })
  } catch (err) {
    console.error('Failed to sign staff document URL:', err)
    res.status(500).json({ error: 'Failed to open the document.' })
  }
})

router.get('/:id/work-logs', async (req, res) => {
  const month = String(req.query.month || '')
  if (!MONTH_PATTERN.test(month)) return res.status(400).json({ error: 'month must be YYYY-MM.' })
  try {
    const logs = await prisma.staffWorkLog.findMany({
      where: { staffId: req.params.id, date: monthRange(month) },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })
    res.json(logs.map(serializeWorkLog))
  } catch (err) {
    console.error('Failed to list staff work logs:', err)
    res.status(500).json({ error: 'Failed to load hours.' })
  }
})

router.get('/:id/payouts', async (req, res) => {
  try {
    const payouts = await prisma.staffPayout.findMany({ where: { staffId: req.params.id }, orderBy: { paidOn: 'desc' } })
    res.json(payouts.map(serializePayout))
  } catch (err) {
    console.error('Failed to list payouts:', err)
    res.status(500).json({ error: 'Failed to load payments.' })
  }
})

router.post('/:id/payouts', async (req, res) => {
  const month = String(req.body.month || '')
  const paidOn = String(req.body.paidOn || '')
  const paymentMode = req.body.paymentMode
  const referenceNo = clean(req.body.referenceNo, 100)
  const recordExpense = req.body.recordExpense !== false

  if (!MONTH_PATTERN.test(month)) return res.status(400).json({ error: 'month must be YYYY-MM.' })
  const paidOnDate = new Date(`${paidOn}T00:00:00.000Z`)
  if (!DATE_PATTERN.test(paidOn) || Number.isNaN(paidOnDate.getTime())) return res.status(400).json({ error: 'Choose a valid payment date.' })
  if (paidOnDate.getTime() > Date.now() + 24 * 60 * 60 * 1000) return res.status(400).json({ error: 'Payment date cannot be in the future.' })
  if (!PAYMENT_MODES.includes(paymentMode)) return res.status(400).json({ error: 'Choose a payment mode.' })

  try {
    const staff = await loadStaff(req, res)
    if (!staff) return

    const result = await prisma.$transaction(async (tx) => {
      const logs = await tx.staffWorkLog.findMany({
        where: { staffId: staff.id, status: 'approved', payoutId: null, date: monthRange(month) },
      })
      if (logs.length === 0) return { error: 'There are no approved, unpaid hours for this month.' }

      const minutes = logs.reduce((sum, l) => sum + l.minutes, 0)
      const amount = logs.reduce((sum, l) => sum + (l.amount || 0), 0)

      let expenseId = null
      if (recordExpense) {
        const category =
          (await tx.expenseCategory.findFirst({ where: { icon: 'salaries' }, orderBy: { sortOrder: 'asc' } })) ||
          (await tx.expenseCategory.findFirst({ where: { icon: 'other' }, orderBy: { sortOrder: 'asc' } }))
        if (category) {
          const [y, m] = month.split('-').map(Number)
          const monthLabel = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', timeZone: 'UTC' })
          const expense = await tx.expense.create({
            data: {
              categoryId: category.id,
              title: `Staff honorarium - ${staff.name} (${staff.staffCode}) - ${monthLabel}`,
              amount,
              date: paidOnDate,
              paymentMode,
              paidTo: staff.name,
              referenceNo,
              notes: `${(minutes / 60).toFixed(2).replace(/\.00$/, '')} hours of approved work in ${monthLabel}.`,
              createdByEmail: req.admin.email,
              updatedByEmail: req.admin.email,
            },
          })
          expenseId = expense.id
        }
      }

      const payout = await tx.staffPayout.create({
        data: { staffId: staff.id, month, minutes, amount, paidOn: paidOnDate, paymentMode, referenceNo, expenseId, createdByEmail: req.admin.email },
      })
      await tx.staffWorkLog.updateMany({ where: { id: { in: logs.map((l) => l.id) } }, data: { payoutId: payout.id } })
      return { payout }
    })

    if (result.error) return res.status(409).json({ error: result.error })
    await logAudit({
      adminEmail: req.admin.email,
      action: 'STAFF_PAID',
      newValue: { staffCode: staff.staffCode, payoutId: result.payout.id, month, amount: result.payout.amount, expenseId: result.payout.expenseId },
    })
    res.status(201).json(serializePayout(result.payout))
  } catch (err) {
    console.error('Failed to record staff payout:', err)
    res.status(500).json({ error: 'Failed to record the payment.' })
  }
})

export default router
