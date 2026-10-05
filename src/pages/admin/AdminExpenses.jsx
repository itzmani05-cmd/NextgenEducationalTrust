import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Tags } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import {
  listExpenses, createExpense, updateExpense, deleteExpense, getExpenseBillSignedUrl,
  listExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory, AuthError,
} from '../../utils/adminApi.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import ExpenseSummaryCards from '../../components/admin/expenses/ExpenseSummaryCards.jsx'
import ExpensesFiltersBar from '../../components/admin/expenses/ExpensesFiltersBar.jsx'
import ExpensesTable from '../../components/admin/expenses/ExpensesTable.jsx'
import AddExpenseModal from '../../components/admin/expenses/AddExpenseModal.jsx'
import ManageCategoriesModal from '../../components/admin/expenses/ManageCategoriesModal.jsx'
import ExportMenu from '../../components/admin/expenses/ExportMenu.jsx'
import { exportExpensesCsv, exportExpensesPdf, exportExpenseVoucherPdf } from '../../components/admin/expenses/exportExpenses.js'

const byDateDesc = (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)

export default function AdminExpenses() {
  const { token, logout } = useAdminAuth()
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [month, setMonth] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState({ open: false, expense: null })
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([listExpenses(token), listExpenseCategories(token)])
      .then(([expenseRows, categoryRows]) => {
        if (cancelled) return
        setExpenses(expenseRows)
        setCategories(categoryRows)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setError(err.message || 'Failed to load expenses.')
      })
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [token, logout])

  const categoriesById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories])

  const guard = useCallback(async (fn) => {
    try {
      return await fn()
    } catch (err) {
      if (err instanceof AuthError) logout()
      throw err
    }
  }, [logout])

  const adjustCount = (categoryId, delta) => {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, expenseCount: c.expenseCount + delta } : c)))
  }

  const openAdd = () => setModal({ open: true, expense: null })
  const openEdit = (expense) => setModal({ open: true, expense })
  const closeModal = useCallback(() => setModal({ open: false, expense: null }), [])
  const closeCategories = useCallback(() => setCategoriesOpen(false), [])
  const cancelDelete = useCallback(() => setPendingDelete(null), [])

  const handleSave = async (data) => {
    const existing = modal.expense
    const saved = await guard(() => (existing ? updateExpense(token, existing.id, data) : createExpense(token, data)))
    setExpenses((prev) => (existing ? prev.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...prev]).sort(byDateDesc))
    if (!existing) adjustCount(saved.categoryId, 1)
    else if (existing.categoryId !== saved.categoryId) {
      adjustCount(existing.categoryId, -1)
      adjustCount(saved.categoryId, 1)
    }
    closeModal()
  }

  const confirmDelete = async () => {
    const target = pendingDelete
    setPendingDelete(null)
    try {
      await guard(() => deleteExpense(token, target.id))
      setExpenses((prev) => prev.filter((e) => e.id !== target.id))
      adjustCount(target.categoryId, -1)
    } catch (err) {
      setError(err.message || 'Failed to delete expense.')
    }
  }

  const handleViewBill = async (id) => {
    try {
      const { url } = await guard(() => getExpenseBillSignedUrl(token, id))
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err.message || 'Failed to open bill.')
    }
  }

  const handleCreateCategory = async (data) => {
    const created = await guard(() => createExpenseCategory(token, data))
    setCategories((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)))
    return created
  }

  const handleUpdateCategory = async (id, data) => {
    const updated = await guard(() => updateExpenseCategory(token, id, data))
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  const handleDeleteCategory = async (id) => {
    await guard(() => deleteExpenseCategory(token, id))
    setCategories((prev) => prev.filter((c) => c.id !== id))
    if (category === id) setCategory('')
  }

  const filtered = expenses.filter((e) => {
    if (category && e.categoryId !== category) return false
    if (month && !e.date.startsWith(month)) return false
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      e.title.toLowerCase().includes(q) ||
      e.paidTo?.toLowerCase().includes(q) ||
      e.referenceNo?.toLowerCase().includes(q) ||
      e.notes?.toLowerCase().includes(q)
    )
  })

  const handleDownloadVoucher = async (expense) => {
    try {
      const billUrl = expense.billPath ? (await guard(() => getExpenseBillSignedUrl(token, expense.id))).url : null
      await exportExpenseVoucherPdf(expense, categoriesById, { billUrl })
    } catch (err) {
      setError(err.message || 'Failed to download the voucher.')
    }
  }

  const handleExport = async (format) => {
    try {
      if (format === 'csv') return exportExpensesCsv(filtered, categoriesById)
      await exportExpensesPdf(filtered, categoriesById, { month })
    } catch (err) {
      setError(err.message || 'Failed to export expenses.')
    }
  }

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Expenses</h1>
          <p className="text-brand-muted text-sm">Track where the Trust&rsquo;s funds are spent.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu disabled={loading || filtered.length === 0} onExport={handleExport} />
          <button
            type="button"
            onClick={() => setCategoriesOpen(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white border border-brand-border text-brand-text px-4 py-2.5 rounded-lg text-sm font-semibold hover:border-brand-navy transition-colors disabled:opacity-50"
          >
            <Tags className="w-4 h-4" /> Categories
          </button>
          <button
            type="button"
            onClick={openAdd}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      <ErrorBanner message={error} />

      <ExpenseSummaryCards expenses={expenses} categoriesById={categoriesById} loading={loading} />

      <ExpensesFiltersBar
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        month={month}
        onMonthChange={setMonth}
        search={search}
        onSearchChange={setSearch}
      />

      <ExpensesTable
        expenses={filtered}
        categoriesById={categoriesById}
        loading={loading}
        resetKey={`${category}|${month}|${search}`}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onAdd={openAdd}
        onViewBill={handleViewBill}
        onDownloadVoucher={handleDownloadVoucher}
      />

      <AddExpenseModal
        open={modal.open}
        expense={modal.expense}
        categories={categories}
        onClose={closeModal}
        onSave={handleSave}
        onCreateCategory={handleCreateCategory}
        onViewBill={handleViewBill}
      />

      <ManageCategoriesModal
        open={categoriesOpen}
        categories={categories}
        onClose={closeCategories}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete expense?"
        message={pendingDelete ? `"${pendingDelete.title}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
