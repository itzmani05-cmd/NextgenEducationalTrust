import { useEffect, useState } from 'react'
import { X, Upload, FileText } from 'lucide-react'
import { EXPENSE_CATEGORIES, PAYMENT_MODES } from './expenseConstants.js'

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY_FORM = {
  category: '',
  title: '',
  amount: '',
  date: '',
  paymentMode: 'bank_transfer',
  paidTo: '',
  referenceNo: '',
  notes: '',
}

const inputClasses =
  'w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base sm:text-sm text-brand-text placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors'

function Field({ label, required, error, children, hint }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-brand-text mb-1.5">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="block text-xs text-brand-red mt-1">{error}</span>
      ) : (
        hint && <span className="block text-xs text-brand-muted mt-1">{hint}</span>
      )}
    </label>
  )
}

// `expense` is null for "add", or an existing row for "edit".
export default function AddExpenseModal({ open, expense, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [receipt, setReceipt] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(expense ? { ...EMPTY_FORM, ...expense, amount: String(expense.amount) } : { ...EMPTY_FORM, date: today() })
    setReceipt(null)
    setErrors({})
  }, [open, expense])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target ? e.target.value : e }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.category) next.category = 'Choose a category.'
    if (!form.title.trim()) next.title = 'Enter what the money was spent on.'
    if (!(Number(form.amount) > 0)) next.amount = 'Enter an amount greater than 0.'
    if (!form.date) next.date = 'Pick the date of the expense.'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...form, title: form.title.trim(), amount: Number(form.amount) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4" onClick={onClose} role="presentation">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={expense ? 'Edit expense' : 'Add expense'}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
        className="bg-white w-full sm:max-w-2xl max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-xl shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-brand-border">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">{expense ? 'Edit Expense' : 'Add Expense'}</h2>
            <p className="text-xs text-brand-muted mt-0.5">Record money spent by the Trust. Fields marked * are required.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-text" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <p className="text-xs font-semibold text-brand-text mb-2">
              Category <span className="text-brand-red">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map(({ value, label, icon: Icon, accent }) => {
                const selected = form.category === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: value }))}
                    aria-pressed={selected}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                      selected
                        ? 'border-brand-navy bg-blue-50/60 ring-1 ring-brand-navy text-brand-text'
                        : 'border-brand-border text-brand-text hover:border-brand-navy/50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${accent}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="leading-tight">{label}</span>
                  </button>
                )
              })}
            </div>
            {errors.category && <p className="text-xs text-brand-red mt-1.5">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Expense Name" required error={errors.title}>
                <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Textbooks for Class 10 students" className={inputClasses} />
              </Field>
            </div>
            <Field label="Amount Spent" required error={errors.amount}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">₹</span>
                <input type="number" inputMode="decimal" min="0" step="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" className={`${inputClasses} pl-7`} />
              </div>
            </Field>
            <Field label="Date" required error={errors.date}>
              <input type="date" value={form.date} max={today()} onChange={set('date')} className={inputClasses} />
            </Field>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-text mb-2">Payment Mode</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, paymentMode: m.value }))}
                  aria-pressed={form.paymentMode === m.value}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.paymentMode === m.value
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : 'bg-white text-brand-text border-brand-border hover:border-brand-navy'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Paid To" hint="Vendor, person or institution">
              <input type="text" value={form.paidTo} onChange={set('paidTo')} placeholder="e.g. Higginbothams" className={inputClasses} />
            </Field>
            <Field label="Reference / Transaction No." hint={form.paymentMode === 'cash' ? 'Optional for cash' : 'UTR, cheque or bill number'}>
              <input type="text" value={form.referenceNo} onChange={set('referenceNo')} placeholder="e.g. UPI4521907733" className={inputClasses} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Any extra details (optional)" className={`${inputClasses} resize-none`} />
              </Field>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-text mb-2">Bill / Receipt</p>
            {receipt ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-border px-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4.5 h-4.5 text-brand-navy shrink-0" />
                  <span className="text-sm text-brand-text truncate">{receipt.name}</span>
                </div>
                <button type="button" onClick={() => setReceipt(null)} className="text-xs font-semibold text-brand-red hover:underline shrink-0">
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-brand-border px-4 py-5 text-center cursor-pointer hover:border-brand-navy/50 hover:bg-brand-surface transition-colors">
                <Upload className="w-5 h-5 text-brand-muted" />
                <span className="text-sm font-medium text-brand-text">Click to upload bill</span>
                <span className="text-xs text-brand-muted">PDF, JPG or PNG up to 1MB (optional)</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-brand-border bg-brand-surface/60 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-muted hover:bg-white transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 transition-all">
            {expense ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}
