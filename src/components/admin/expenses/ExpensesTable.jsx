import { useState } from 'react'
import { Pencil, Trash2, Receipt, Paperclip } from 'lucide-react'
import { formatINR, formatExpenseDate, getPaymentModeLabel, resolveCategory } from './expenseConstants.js'

function CategoryBadge({ category }) {
  const { name, icon: Icon, accent } = category
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${accent}`}>
      <Icon className="w-3.5 h-3.5" />
      {name}
    </span>
  )
}

function BillLink({ expense, onViewBill }) {
  const [opening, setOpening] = useState(false)
  const open = async () => {
    setOpening(true)
    try {
      await onViewBill(expense.id)
    } finally {
      setOpening(false)
    }
  }
  return (
    <button
      type="button"
      onClick={open}
      disabled={opening}
      title={expense.billFileName || 'View bill'}
      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:underline disabled:opacity-50 mt-1"
    >
      <Paperclip className="w-3.5 h-3.5" /> {opening ? 'Opening…' : 'View bill'}
    </button>
  )
}

export default function ExpensesTable({ expenses, categoriesById, loading, onEdit, onDelete, onAdd, onViewBill }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs text-brand-muted uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Expense</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Paid To</th>
              <th className="px-5 py-3 font-semibold">Payment</th>
              <th className="px-5 py-3 font-semibold text-right">Amount</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-brand-muted">Loading expenses…</td>
              </tr>
            )}
            {!loading && expenses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center">
                  <div className="mx-auto w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center mb-3">
                    <Receipt className="w-5 h-5 text-brand-muted" />
                  </div>
                  <p className="font-semibold text-brand-text">No expenses found</p>
                  <p className="text-brand-muted text-xs mt-1 mb-4">Try changing the filters, or record a new expense.</p>
                  <button
                    type="button"
                    onClick={onAdd}
                    className="text-sm font-semibold text-brand-navy hover:underline"
                  >
                    + Add expense
                  </button>
                </td>
              </tr>
            )}
            {expenses.map((e) => (
              <tr key={e.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors align-top">
                <td className="px-5 py-3 text-brand-muted whitespace-nowrap">
                  {formatExpenseDate(e.date)}
                </td>
                <td className="px-5 py-3 min-w-[14rem]">
                  <div className="font-medium text-brand-text">{e.title}</div>
                  {e.notes && <div className="text-xs text-brand-muted mt-0.5">{e.notes}</div>}
                  {e.billPath && <BillLink expense={e} onViewBill={onViewBill} />}
                </td>
                <td className="px-5 py-3"><CategoryBadge category={resolveCategory(categoriesById, e.categoryId)} /></td>
                <td className="px-5 py-3 text-brand-text">{e.paidTo || '—'}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-brand-text">{getPaymentModeLabel(e.paymentMode)}</div>
                  {e.referenceNo && <div className="text-xs text-brand-muted">{e.referenceNo}</div>}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-brand-text whitespace-nowrap">{formatINR(e.amount)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(e)}
                      className="p-1.5 rounded-lg text-brand-muted hover:bg-white hover:text-brand-navy transition-colors"
                      aria-label={`Edit ${e.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(e)}
                      className="p-1.5 rounded-lg text-brand-muted hover:bg-white hover:text-brand-red transition-colors"
                      aria-label={`Delete ${e.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {!loading && expenses.length > 0 && (
            <tfoot>
              <tr className="border-t border-brand-border bg-brand-surface">
                <td colSpan={5} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  Total ({expenses.length} {expenses.length === 1 ? 'entry' : 'entries'})
                </td>
                <td className="px-5 py-3 text-right font-bold text-brand-text whitespace-nowrap">{formatINR(total)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
