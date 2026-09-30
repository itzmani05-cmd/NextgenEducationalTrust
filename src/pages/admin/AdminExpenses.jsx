import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ExpenseSummaryCards from '../../components/admin/expenses/ExpenseSummaryCards.jsx'
import ExpensesFiltersBar from '../../components/admin/expenses/ExpensesFiltersBar.jsx'
import ExpensesTable from '../../components/admin/expenses/ExpensesTable.jsx'
import AddExpenseModal from '../../components/admin/expenses/AddExpenseModal.jsx'
import { SAMPLE_EXPENSES } from '../../components/admin/expenses/expenseConstants.js'

// UI-only for now: expenses live in local state seeded with sample rows.
// The backend (Supabase table + server routes) will replace this.
export default function AdminExpenses() {
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES)
  const [category, setCategory] = useState('')
  const [month, setMonth] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState({ open: false, expense: null })
  const [pendingDelete, setPendingDelete] = useState(null)

  const openAdd = () => setModal({ open: true, expense: null })
  const openEdit = (expense) => setModal({ open: true, expense })
  const closeModal = useCallback(() => setModal({ open: false, expense: null }), [])
  const cancelDelete = useCallback(() => setPendingDelete(null), [])

  const handleSave = (data) => {
    setExpenses((prev) => {
      const next = modal.expense
        ? prev.map((e) => (e.id === modal.expense.id ? { ...e, ...data } : e))
        : [{ ...data, id: `local-${Date.now()}` }, ...prev]
      return next.sort((a, b) => b.date.localeCompare(a.date))
    })
    closeModal()
  }

  const confirmDelete = () => {
    setExpenses((prev) => prev.filter((e) => e.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  const filtered = expenses.filter((e) => {
    if (category && e.category !== category) return false
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

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Expenses</h1>
          <p className="text-brand-muted text-sm">Track where the Trust&rsquo;s funds are spent.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <ExpenseSummaryCards expenses={expenses} />

      <ExpensesFiltersBar
        category={category}
        onCategoryChange={setCategory}
        month={month}
        onMonthChange={setMonth}
        search={search}
        onSearchChange={setSearch}
      />

      <ExpensesTable expenses={filtered} onEdit={openEdit} onDelete={setPendingDelete} onAdd={openAdd} />

      <AddExpenseModal open={modal.open} expense={modal.expense} onClose={closeModal} onSave={handleSave} />

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
