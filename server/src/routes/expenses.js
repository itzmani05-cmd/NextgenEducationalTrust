import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireAdmin } from '../auth.js'
import { logAudit } from '../audit.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from '../supabaseAdmin.js'

const router = Router()

const CATEGORY_ICONS = [
  'scholarship', 'education_materials', 'events', 'salaries', 'rent_utilities',
  'office_supplies', 'travel', 'maintenance', 'marketing', 'health', 'food', 'technology', 'other',
]
const PAYMENT_MODES = ['cash', 'upi', 'bank_transfer', 'cheque', 'card']
const BILL_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
})

router.use(requireAdmin)

function serializeExpense(expense) {
  return { ...expense, date: expense.date.toISOString().slice(0, 10) }
}

function cleanOptional(value, max = 200) {
  const s = String(value ?? '').trim().slice(0, max)
  return s || null
}

async function validateExpenseBody(body) {
  const title = String(body.title || '').trim()
  const amount = Number(body.amount)
  const date = String(body.date || '').trim()

  if (!title) return { error: 'Expense name is required.' }
  if (title.length > 200) return { error: 'Expense name is too long (max 200 characters).' }
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'Amount must be greater than 0.' }
  if (!PAYMENT_MODES.includes(body.paymentMode)) {
    return { error: `paymentMode must be one of: ${PAYMENT_MODES.join(', ')}` }
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`)
  if (!DATE_PATTERN.test(date) || Number.isNaN(parsedDate.getTime())) {
    return { error: 'A valid date (YYYY-MM-DD) is required.' }
  }
  if (parsedDate.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    return { error: 'Expense date cannot be in the future.' }
  }

  const category = body.categoryId
    ? await prisma.expenseCategory.findUnique({ where: { id: String(body.categoryId) } })
    : null
  if (!category) return { error: 'Choose a valid category.' }

  return {
    data: {
      categoryId: category.id,
      title,
      amount: Math.round(amount),
      date: parsedDate,
      paymentMode: body.paymentMode,
      paidTo: cleanOptional(body.paidTo),
      referenceNo: cleanOptional(body.referenceNo, 100),
      notes: cleanOptional(body.notes, 1000),
    },
  }
}

function checkBillFile(file) {
  if (file && !BILL_MIME_TYPES.includes(file.mimetype)) {
    return 'Bill must be a PDF, JPG, PNG or WebP file.'
  }
  return null
}

async function uploadBill(expenseId, file) {
  const ext = (file.originalname.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `expenses/${expenseId}/bill-${Date.now()}.${ext}`
  const { error } = await getSupabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .upload(path, file.buffer, { contentType: file.mimetype, upsert: true })
  if (error) throw error
  return { billPath: path, billFileName: file.originalname.slice(0, 200) }
}

async function removeBill(path) {
  if (!path) return
  try {
    const { error } = await getSupabaseAdmin().storage.from(STORAGE_BUCKET).remove([path])
    if (error) throw error
  } catch (err) {
    console.error('Failed to remove expense bill from storage:', err)
  }
}

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { expenses: true } } },
    })
    res.json(categories.map(({ _count, ...c }) => ({ ...c, expenseCount: _count.expenses })))
  } catch (err) {
    console.error('Failed to list expense categories:', err)
    res.status(500).json({ error: 'Failed to load categories.' })
  }
})

function validateCategoryBody(body) {
  const name = String(body.name || '').trim().replace(/\s+/g, ' ')
  const icon = body.icon || 'other'
  if (!name) return { error: 'Category name is required.' }
  if (name.length > 60) return { error: 'Category name is too long (max 60 characters).' }
  if (!CATEGORY_ICONS.includes(icon)) return { error: 'Choose a valid icon.' }
  return { data: { name, icon } }
}

async function nameTaken(name, exceptId) {
  const existing = await prisma.expenseCategory.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, ...(exceptId ? { id: { not: exceptId } } : {}) },
  })
  return !!existing
}

router.post('/categories', async (req, res) => {
  const { data, error } = validateCategoryBody(req.body)
  if (error) return res.status(400).json({ error })

  try {
    if (await nameTaken(data.name)) {
      return res.status(409).json({ error: `A category named "${data.name}" already exists.` })
    }
    const last = await prisma.expenseCategory.findFirst({
      where: { sortOrder: { lt: 1000 } },
      orderBy: { sortOrder: 'desc' },
    })
    const category = await prisma.expenseCategory.create({
      data: { ...data, sortOrder: Math.min((last?.sortOrder ?? 0) + 10, 999) },
    })
    await logAudit({ adminEmail: req.admin.email, action: 'EXPENSE_CATEGORY_CREATED', newValue: category })
    res.status(201).json({ ...category, expenseCount: 0 })
  } catch (err) {
    console.error('Failed to create expense category:', err)
    res.status(500).json({ error: 'Failed to create category.' })
  }
})

router.patch('/categories/:id', async (req, res) => {
  const { data, error } = validateCategoryBody(req.body)
  if (error) return res.status(400).json({ error })

  try {
    const existing = await prisma.expenseCategory.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Category not found.' })
    if (await nameTaken(data.name, existing.id)) {
      return res.status(409).json({ error: `A category named "${data.name}" already exists.` })
    }

    const category = await prisma.expenseCategory.update({
      where: { id: existing.id },
      data,
      include: { _count: { select: { expenses: true } } },
    })
    await logAudit({ adminEmail: req.admin.email, action: 'EXPENSE_CATEGORY_UPDATED', oldValue: existing, newValue: data })
    const { _count, ...rest } = category
    res.json({ ...rest, expenseCount: _count.expenses })
  } catch (err) {
    console.error('Failed to update expense category:', err)
    res.status(500).json({ error: 'Failed to update category.' })
  }
})

router.delete('/categories/:id', async (req, res) => {
  try {
    const existing = await prisma.expenseCategory.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { expenses: true } } },
    })
    if (!existing) return res.status(404).json({ error: 'Category not found.' })
    if (existing._count.expenses > 0) {
      return res.status(409).json({
        error: `"${existing.name}" is used by ${existing._count.expenses} expense(s). Move or delete those first.`,
      })
    }

    await prisma.expenseCategory.delete({ where: { id: existing.id } })
    await logAudit({ adminEmail: req.admin.email, action: 'EXPENSE_CATEGORY_DELETED', oldValue: { id: existing.id, name: existing.name } })
    res.status(204).end()
  } catch (err) {
    console.error('Failed to delete expense category:', err)
    res.status(500).json({ error: 'Failed to delete category.' })
  }
})

router.get('/', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })
    res.json(expenses.map(serializeExpense))
  } catch (err) {
    console.error('Failed to list expenses:', err)
    res.status(500).json({ error: 'Failed to load expenses.' })
  }
})

router.post('/', upload.single('bill'), async (req, res) => {
  const fileError = checkBillFile(req.file)
  if (fileError) return res.status(400).json({ error: fileError })

  try {
    const { data, error } = await validateExpenseBody(req.body)
    if (error) return res.status(400).json({ error })

    let expense = await prisma.expense.create({
      data: { ...data, createdByEmail: req.admin.email, updatedByEmail: req.admin.email },
    })

    if (req.file) {
      try {
        expense = await prisma.expense.update({ where: { id: expense.id }, data: await uploadBill(expense.id, req.file) })
      } catch (uploadErr) {
        await prisma.expense.delete({ where: { id: expense.id } }).catch(() => {})
        throw uploadErr
      }
    }

    await logAudit({
      adminEmail: req.admin.email,
      action: 'EXPENSE_CREATED',
      newValue: { expenseId: expense.id, title: expense.title, amount: expense.amount },
    })
    res.status(201).json(serializeExpense(expense))
  } catch (err) {
    console.error('Failed to create expense:', err)
    res.status(500).json({ error: 'Failed to save expense.' })
  }
})

router.patch('/:id', upload.single('bill'), async (req, res) => {
  const fileError = checkBillFile(req.file)
  if (fileError) return res.status(400).json({ error: fileError })

  try {
    const existing = await prisma.expense.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Expense not found.' })

    const { data, error } = await validateExpenseBody(req.body)
    if (error) return res.status(400).json({ error })

    let billPatch = {}
    if (req.file) billPatch = await uploadBill(existing.id, req.file)
    else if (req.body.removeBill === 'true') billPatch = { billPath: null, billFileName: null }

    const expense = await prisma.expense.update({
      where: { id: existing.id },
      data: { ...data, ...billPatch, updatedByEmail: req.admin.email },
    })
    if ('billPath' in billPatch && existing.billPath && existing.billPath !== billPatch.billPath) {
      await removeBill(existing.billPath)
    }

    await logAudit({
      adminEmail: req.admin.email,
      action: 'EXPENSE_UPDATED',
      oldValue: { title: existing.title, amount: existing.amount, categoryId: existing.categoryId, date: existing.date },
      newValue: { expenseId: expense.id, title: expense.title, amount: expense.amount, categoryId: expense.categoryId, date: expense.date },
    })
    res.json(serializeExpense(expense))
  } catch (err) {
    console.error('Failed to update expense:', err)
    res.status(500).json({ error: 'Failed to update expense.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const existing = await prisma.expense.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Expense not found.' })

    await prisma.expense.delete({ where: { id: existing.id } })
    await removeBill(existing.billPath)
    await logAudit({
      adminEmail: req.admin.email,
      action: 'EXPENSE_DELETED',
      oldValue: { expenseId: existing.id, title: existing.title, amount: existing.amount, date: existing.date },
    })
    res.status(204).end()
  } catch (err) {
    console.error('Failed to delete expense:', err)
    res.status(500).json({ error: 'Failed to delete expense.' })
  }
})

router.get('/:id/bill/signed-url', async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({ where: { id: req.params.id } })
    if (!expense?.billPath) return res.status(404).json({ error: 'No bill uploaded for this expense.' })

    const { data, error } = await getSupabaseAdmin()
      .storage.from(STORAGE_BUCKET)
      .createSignedUrl(expense.billPath, 30 * 60)
    if (error) throw error
    res.json({ url: data.signedUrl })
  } catch (err) {
    console.error('Failed to create expense bill signed URL:', err)
    res.status(500).json({ error: 'Failed to open bill.' })
  }
})

export default router
