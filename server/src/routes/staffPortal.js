import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireStaff } from '../auth.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from '../supabaseAdmin.js'
import {
  STAFF_DOCUMENT_KINDS, STAFF_DOCUMENT_MIME_TYPES, STAFF_DOCUMENT_MAX_BYTES, DATE_PATTERN, MONTH_PATTERN,
  profileCompleteness, serializeStaff, serializeWorkLog, serializePayout, monthRange,
} from '../staffConstants.js'

const router = Router()

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: STAFF_DOCUMENT_MAX_BYTES } })

function uploadSingle(field) {
  return (req, res, next) =>
    upload.single(field)(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File is too large. The maximum size is 2MB.' })
      }
      next(err)
    })
}

router.get('/me', requireStaff({ allowPasswordChange: true }), async (req, res) => {
  try {
    const documents = await prisma.staffDocument.findMany({ where: { staffId: req.staff.id }, orderBy: { createdAt: 'asc' } })
    res.json({ ...serializeStaff(req.staff), documents, completeness: profileCompleteness(req.staff, documents) })
  } catch (err) {
    console.error('Failed to load staff profile:', err)
    res.status(500).json({ error: 'Failed to load your profile.' })
  }
})

router.use(requireStaff())

const clean = (value, max = 200) => {
  const s = String(value ?? '').trim().slice(0, max)
  return s || null
}

function validateProfile(body) {
  const data = {
    phone: clean(body.phone, 20),
    email: clean(body.email, 120),
    dob: clean(body.dob, 10),
    gender: clean(body.gender, 20),
    address: clean(body.address, 500),
    qualification: clean(body.qualification, 60),
    degree: clean(body.degree, 120),
    institution: clean(body.institution, 200),
    subjects: clean(body.subjects, 300),
    bankAccountName: clean(body.bankAccountName, 120),
    bankAccountNumber: clean(body.bankAccountNumber, 30)?.replace(/\s+/g, '') || null,
    bankIfsc: clean(body.bankIfsc, 11)?.toUpperCase() || null,
    bankName: clean(body.bankName, 120),
    pan: clean(body.pan, 10)?.toUpperCase() || null,
  }
  const year = clean(body.passingYear, 4)
  const experience = clean(body.experienceYears, 2)
  data.passingYear = year ? Number(year) : null
  data.experienceYears = experience !== null ? Number(experience) : null

  const thisYear = new Date().getFullYear()
  if (data.phone && !/^[6-9]\d{9}$/.test(data.phone)) return { error: 'Enter a valid 10-digit mobile number.' }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'Enter a valid email address.' }
  if (data.dob && (!DATE_PATTERN.test(data.dob) || Number.isNaN(Date.parse(data.dob)))) return { error: 'Enter a valid date of birth.' }
  if (data.passingYear !== null && !(Number.isInteger(data.passingYear) && data.passingYear >= 1950 && data.passingYear <= thisYear)) {
    return { error: 'Enter a valid year of passing.' }
  }
  if (data.experienceYears !== null && !(Number.isInteger(data.experienceYears) && data.experienceYears >= 0 && data.experienceYears <= 60)) {
    return { error: 'Experience must be a whole number of years.' }
  }
  if (data.bankAccountNumber && !/^\d{9,18}$/.test(data.bankAccountNumber)) return { error: 'Bank account number must be 9 to 18 digits.' }
  if (data.bankIfsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.bankIfsc)) return { error: 'Enter a valid 11-character IFSC code (e.g. SBIN0001234).' }
  if (data.pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(data.pan)) return { error: 'Enter a valid PAN (e.g. ABCDE1234F).' }
  return { data }
}

router.patch('/me', async (req, res) => {
  const { data, error } = validateProfile(req.body)
  if (error) return res.status(400).json({ error })
  try {
    const staff = await prisma.staff.update({ where: { id: req.staff.id }, data })
    const documents = await prisma.staffDocument.findMany({ where: { staffId: staff.id }, orderBy: { createdAt: 'asc' } })
    res.json({ ...serializeStaff(staff), documents, completeness: profileCompleteness(staff, documents) })
  } catch (err) {
    console.error('Failed to update staff profile:', err)
    res.status(500).json({ error: 'Failed to save your profile.' })
  }
})

router.post('/me/documents', uploadSingle('file'), async (req, res) => {
  const kind = String(req.body.kind || '')
  const spec = STAFF_DOCUMENT_KINDS[kind]
  if (!spec) return res.status(400).json({ error: 'Unknown document type.' })
  if (!req.file) return res.status(400).json({ error: 'Choose a file to upload.' })
  if (!STAFF_DOCUMENT_MIME_TYPES.includes(req.file.mimetype) || (spec.imageOnly && !req.file.mimetype.startsWith('image/'))) {
    return res.status(400).json({ error: spec.imageOnly ? 'Photo must be a JPG, PNG or WebP image.' : 'File must be a PDF, JPG, PNG or WebP.' })
  }

  const ext = (req.file.originalname.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `staff/${req.staff.id}/${kind}-${Date.now()}.${ext}`
  try {
    const storage = getSupabaseAdmin().storage.from(STORAGE_BUCKET)
    const { error } = await storage.upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: false })
    if (error) throw error

    const replaced = spec.multiple ? [] : await prisma.staffDocument.findMany({ where: { staffId: req.staff.id, kind } })
    const document = await prisma.$transaction(async (tx) => {
      if (replaced.length) await tx.staffDocument.deleteMany({ where: { id: { in: replaced.map((d) => d.id) } } })
      return tx.staffDocument.create({
        data: { staffId: req.staff.id, kind, path, fileName: req.file.originalname.slice(0, 200), mimeType: req.file.mimetype },
      })
    })
    if (replaced.length) await storage.remove(replaced.map((d) => d.path)).catch(() => {})
    res.status(201).json(document)
  } catch (err) {
    console.error('Failed to upload staff document:', err)
    res.status(500).json({ error: 'Failed to upload the document.' })
  }
})

router.delete('/me/documents/:docId', async (req, res) => {
  try {
    const document = await prisma.staffDocument.findFirst({ where: { id: req.params.docId, staffId: req.staff.id } })
    if (!document) return res.status(404).json({ error: 'Document not found.' })
    await prisma.staffDocument.delete({ where: { id: document.id } })
    await getSupabaseAdmin().storage.from(STORAGE_BUCKET).remove([document.path]).catch(() => {})
    res.status(204).end()
  } catch (err) {
    console.error('Failed to delete staff document:', err)
    res.status(500).json({ error: 'Failed to delete the document.' })
  }
})

router.get('/me/documents/:docId/signed-url', async (req, res) => {
  try {
    const document = await prisma.staffDocument.findFirst({ where: { id: req.params.docId, staffId: req.staff.id } })
    if (!document) return res.status(404).json({ error: 'Document not found.' })
    const { data, error } = await getSupabaseAdmin().storage.from(STORAGE_BUCKET).createSignedUrl(document.path, 10 * 60)
    if (error) throw error
    res.json({ url: data.signedUrl })
  } catch (err) {
    console.error('Failed to sign staff document URL:', err)
    res.status(500).json({ error: 'Failed to open the document.' })
  }
})

router.get('/me/work-logs', async (req, res) => {
  const month = String(req.query.month || '')
  if (!MONTH_PATTERN.test(month)) return res.status(400).json({ error: 'month must be YYYY-MM.' })
  try {
    const logs = await prisma.staffWorkLog.findMany({
      where: { staffId: req.staff.id, date: monthRange(month) },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })
    res.json(logs.map(serializeWorkLog))
  } catch (err) {
    console.error('Failed to list work logs:', err)
    res.status(500).json({ error: 'Failed to load your hours.' })
  }
})

async function validateWorkLog(body, staffId, exceptId) {
  const date = String(body.date || '')
  const minutes = Number(body.minutes)
  const description = String(body.description || '').trim()

  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (!DATE_PATTERN.test(date) || Number.isNaN(parsed.getTime())) return { error: 'Choose a valid date.' }
  if (parsed.getTime() > Date.now() + 24 * 60 * 60 * 1000) return { error: 'You cannot log hours for a future date.' }
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 16 * 60) return { error: 'Hours must be between 15 minutes and 16 hours.' }
  if (!description) return { error: 'Describe the work you did.' }
  if (description.length > 500) return { error: 'Description is too long (max 500 characters).' }

  const sameDay = await prisma.staffWorkLog.aggregate({
    where: { staffId, date: parsed, status: { not: 'rejected' }, ...(exceptId ? { id: { not: exceptId } } : {}) },
    _sum: { minutes: true },
  })
  if ((sameDay._sum.minutes || 0) + minutes > 16 * 60) return { error: 'You cannot log more than 16 hours in one day.' }

  return { data: { date: parsed, minutes, description } }
}

router.post('/me/work-logs', async (req, res) => {
  try {
    const { data, error } = await validateWorkLog(req.body, req.staff.id)
    if (error) return res.status(400).json({ error })
    const log = await prisma.staffWorkLog.create({ data: { ...data, staffId: req.staff.id } })
    res.status(201).json(serializeWorkLog(log))
  } catch (err) {
    console.error('Failed to create work log:', err)
    res.status(500).json({ error: 'Failed to save your hours.' })
  }
})

router.patch('/me/work-logs/:id', async (req, res) => {
  try {
    const existing = await prisma.staffWorkLog.findFirst({ where: { id: req.params.id, staffId: req.staff.id } })
    if (!existing) return res.status(404).json({ error: 'Entry not found.' })
    if (existing.status === 'approved') return res.status(409).json({ error: 'Approved entries can no longer be changed.' })

    const { data, error } = await validateWorkLog(req.body, req.staff.id, existing.id)
    if (error) return res.status(400).json({ error })
    const log = await prisma.staffWorkLog.update({
      where: { id: existing.id },
      data: { ...data, status: 'pending', rejectionReason: null, reviewedAt: null, reviewedByEmail: null },
    })
    res.json(serializeWorkLog(log))
  } catch (err) {
    console.error('Failed to update work log:', err)
    res.status(500).json({ error: 'Failed to update the entry.' })
  }
})

router.delete('/me/work-logs/:id', async (req, res) => {
  try {
    const existing = await prisma.staffWorkLog.findFirst({ where: { id: req.params.id, staffId: req.staff.id } })
    if (!existing) return res.status(404).json({ error: 'Entry not found.' })
    if (existing.status === 'approved') return res.status(409).json({ error: 'Approved entries can no longer be deleted.' })
    await prisma.staffWorkLog.delete({ where: { id: existing.id } })
    res.status(204).end()
  } catch (err) {
    console.error('Failed to delete work log:', err)
    res.status(500).json({ error: 'Failed to delete the entry.' })
  }
})

router.get('/me/payouts', async (req, res) => {
  try {
    const payouts = await prisma.staffPayout.findMany({ where: { staffId: req.staff.id }, orderBy: { paidOn: 'desc' } })
    res.json(payouts.map(serializePayout))
  } catch (err) {
    console.error('Failed to list payouts:', err)
    res.status(500).json({ error: 'Failed to load your payments.' })
  }
})

export default router
