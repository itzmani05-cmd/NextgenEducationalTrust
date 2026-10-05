import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Receipt, Paperclip, FileDown, Loader2 } from 'lucide-react'
import { formatINR, getPaymentModeLabel, resolveCategory } from './expenseConstants.js'
import Pagination from '../Pagination.jsx'

const PAGE_SIZE_KEY = 'ngc_expenses_page_size'

function readPageSize() {
  try {
    const n = Number(localStorage.getItem(PAGE_SIZE_KEY))
    return [10, 25, 50].includes(n) ? n : 10
  } catch {
    return 10
  }
}

function CategoryBadge({ category }) {
  const { name, icon: Icon, accent } = category
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${accent}`}>
      <Icon className="w-3.5 h-3.5" />
      {name}
    </span>
  )
}

function DateCell({ date }) {
  const [y, m, d] = date.split('-').map(Number)
  const value = new Date(y, m - 1, d)
  return (
    <div className="leading-tight">
      <div className="font-semibold text-brand-text">{value.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
      <div className="text-xs text-brand-muted">{y}</div>
    </div>
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
      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-navy hover:bg-blue-100 transition-colors disabled:opacity-50"
    >
      <Paperclip className="w-3 h-3" /> {opening ? 'Opening…' : 'Bill'}
    </button>
  )
}

const iconButton = 'p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface transition-colors disabled:opacity-50'

function VoucherButton({ expense, onDownload }) {
  const [busy, setBusy] = useState(false)
  const download = async () => {
    setBusy(true)
    try {
      await onDownload(expense)
    } finally {
      setBusy(false)
    }
  }
  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      className={`${iconButton} hover:text-brand-navy`}
      aria-label={`Download voucher PDF for ${expense.title}`}
      title="Download voucher PDF"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
    </button>
  )
}

export default function ExpensesTable({ expenses, categoriesById, loading, resetKey, onEdit, onDelete, onAdd, onViewBill, onDownloadVoucher }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(readPageSize)
  const containerRef = useRef(null)

  useEffect(() => setPage(1), [resetKey])

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pageCount = Math.max(1, Math.ceil(expenses.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const rows = expenses.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const goToPage = (next) => {
    setPage(next)
    const top = containerRef.current?.getBoundingClientRect().top
    if (top !== undefined && top < 0) containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const changePageSize = (size) => {
    setPageSize(size)
    setPage(1)
    try {
      localStorage.setItem(PAGE_SIZE_KEY, String(size))
    } catch {
    }
  }

  return (
    <div ref={containerRef} className="bg-white border border-brand-border rounded-xl overflow-hidden scroll-mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-surface/70 border-b border-brand-border text-left text-[11px] text-brand-muted uppercase tracking-wider">
              <th className="pl-5 pr-3 py-3 font-semibold w-24">Date</th>
              <th className="px-3 py-3 font-semibold">Expense</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Paid To</th>
              <th className="px-3 py-3 font-semibold">Payment</th>
              <th className="px-3 py-3 font-semibold text-right">Amount</th>
              <th className="pl-3 pr-5 py-3 font-semibold text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {loading &&
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="pl-5 pr-3 py-4"><div className="h-3.5 w-12 rounded bg-brand-surface" /></td>
                  <td className="px-3 py-4"><div className="h-3.5 w-48 rounded bg-brand-surface" /></td>
                  <td className="px-3 py-4"><div className="h-5 w-24 rounded-full bg-brand-surface" /></td>
                  <td className="px-3 py-4"><div className="h-3.5 w-28 rounded bg-brand-surface" /></td>
                  <td className="px-3 py-4"><div className="h-3.5 w-20 rounded bg-brand-surface" /></td>
                  <td className="px-3 py-4"><div className="h-3.5 w-16 rounded bg-brand-surface ml-auto" /></td>
                  <td className="pl-3 pr-5 py-4" />
                </tr>
              ))}
            {!loading && expenses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center">
                  <div className="mx-auto w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center mb-3">
                    <Receipt className="w-5 h-5 text-brand-muted" />
                  </div>
                  <p className="font-semibold text-brand-text">No expenses found</p>
                  <p className="text-brand-muted text-xs mt-1 mb-4">Try changing the filters, or record a new expense.</p>
                  <button type="button" onClick={onAdd} className="text-sm font-semibold text-brand-navy hover:underline">
                    + Add expense
                  </button>
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((e) => (
                <tr key={e.id} className="group hover:bg-brand-surface/60 transition-colors">
                  <td className="pl-5 pr-3 py-3.5 align-top whitespace-nowrap">
                    <DateCell date={e.date} />
                  </td>
                  <td className="px-3 py-3.5 align-top min-w-[14rem] max-w-[22rem]">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-brand-text leading-snug">{e.title}</span>
                      {e.billPath && <span className="shrink-0 mt-px"><BillLink expense={e} onViewBill={onViewBill} /></span>}
                    </div>
                    {e.notes && (
                      <p className="text-xs text-brand-muted mt-0.5 truncate" title={e.notes}>{e.notes}</p>
                    )}
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <CategoryBadge category={resolveCategory(categoriesById, e.categoryId)} />
                  </td>
                  <td className="px-3 py-3.5 align-top text-brand-text max-w-[12rem]">
                    <span className="block truncate" title={e.paidTo || undefined}>{e.paidTo || <span className="text-brand-muted">—</span>}</span>
                  </td>
                  <td className="px-3 py-3.5 align-top whitespace-nowrap">
                    <div className="text-brand-text">{getPaymentModeLabel(e.paymentMode)}</div>
                    {e.referenceNo && <div className="text-xs text-brand-muted font-mono">{e.referenceNo}</div>}
                  </td>
                  <td className="px-3 py-3.5 align-top text-right font-semibold text-brand-text whitespace-nowrap tabular-nums">
                    {formatINR(e.amount)}
                  </td>
                  <td className="pl-3 pr-5 py-3 align-top">
                    <div className="flex items-center justify-end gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <VoucherButton expense={e} onDownload={onDownloadVoucher} />
                      <button type="button" onClick={() => onEdit(e)} className={`${iconButton} hover:text-brand-navy`} aria-label={`Edit ${e.title}`} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => onDelete(e)} className={`${iconButton} hover:text-brand-red`} aria-label={`Delete ${e.title}`} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
          {!loading && expenses.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-brand-border bg-brand-surface/70">
                <td colSpan={5} className="pl-5 pr-3 py-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Total · {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
                  {pageCount > 1 && <span className="normal-case tracking-normal font-normal"> (all pages)</span>}
                </td>
                <td className="px-3 py-3 text-right font-bold text-brand-navy whitespace-nowrap tabular-nums">{formatINR(total)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {!loading && expenses.length > 0 && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={expenses.length}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
        />
      )}
    </div>
  )
}
