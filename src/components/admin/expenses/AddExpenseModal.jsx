import { useEffect, useState } from 'react'
import { X, Upload, FileText, Plus } from 'lucide-react'
import { PAYMENT_MODES, getIconStyle } from './expenseConstants.js'
import CategoryForm from './CategoryForm.jsx'

const MAX_BILL_BYTES = 1 * 1024 * 1024

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  categoryId: '',
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

export default function AddExpenseModal({ open, expense, categories, onClose, onSave, onCreateCategory, onViewBill }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [bill, setBill] = useState(null)
  const [removeExistingBill, setRemoveExistingBill] = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!open) return
    if (expense) {
      const { categoryId, title, amount, date, paymentMode, paidTo, referenceNo, notes } = expense
      setForm({
        categoryId, title, amount: String(amount), date, paymentMode,
        paidTo: paidTo || '', referenceNo: referenceNo || '', notes: notes || '',
      })
    } else {
      setForm({ ...EMPTY_FORM, date: today() })
    }
    setBill(null)
    setRemoveExistingBill(false)
    setAddingCategory(false)
    setErrors({})
    setSaving(false)
    setSubmitError('')
  }, [open, expense])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => e.key === 'Escape' && !saving && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, saving])

  if (!open) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const hasExistingBill = !!expense?.billPath && !removeExistingBill

  const pickBill = (file) => {
    if (!file) return
    if (file.size > MAX_BILL_BYTES) {
      setErrors((prev) => ({ ...prev, bill: 'File is too large. The maximum size is 1MB.' }))
      return
    }
    setErrors((prev) => ({ ...prev, bill: undefined }))
    setBill(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.categoryId) next.categoryId = 'Choose a category.'
    if (!form.title.trim()) next.title = 'Enter what the money was spent on.'
    if (!(Number(form.amount) > 0)) next.amount = 'Enter an amount greater than 0.'
    if (!form.date) next.date = 'Pick the date of the expense.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    setSubmitError('')
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        bill,
        removeBill: !!expense?.billPath && removeExistingBill && !bill,
      })
    } catch (err) {
      setSubmitError(err.message || 'Failed to save expense.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4" onClick={() => !saving && onClose()} role="presentation">
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
          <button type="button" onClick={onClose} disabled={saving} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-text" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <p className="text-xs font-semibold text-brand-text mb-2">
              Category <span className="text-brand-red">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(({ id, name, icon }) => {
                const { icon: Icon, accent } = getIconStyle(icon)
                const selected = form.categoryId === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, categoryId: id }))}
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
                    <span className="leading-tight">{name}</span>
                  </button>
                )
              })}
              {!addingCategory && (
                <button
                  type="button"
                  onClick={() => setAddingCategory(true)}
                  className="flex items-center gap-2.5 rounded-lg border border-dashed border-brand-border px-3 py-2.5 text-left text-xs font-semibold text-brand-navy hover:border-brand-navy/50 hover:bg-brand-surface transition-colors"
                >
                  <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-brand-surface">
                    <Plus className="w-4 h-4" />
                  </span>
                  New category
                </button>
              )}
            </div>
            {addingCategory && (
              <div className="mt-3">
                <CategoryForm
                  submitLabel="Add Category"
                  onSubmit={async (data) => {
                    const created = await onCreateCategory(data)
                    setForm((f) => ({ ...f, categoryId: created.id }))
                    setAddingCategory(false)
                  }}
                  onCancel={() => setAddingCategory(false)}
                />
              </div>
            )}
            {errors.categoryId && <p className="text-xs text-brand-red mt-1.5">{errors.categoryId}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Expense Name" required error={errors.title}>
                <input type="text" value={form.title} onChange={set('title')} maxLength={200} placeholder="e.g. Textbooks for Class 10 students" className={inputClasses} />
              </Field>
            </div>
            <Field label="Amount Spent" required error={errors.amount}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">₹</span>
                <input type="number" inputMode="numeric" min="1" step="1" value={form.amount} onChange={set('amount')} placeholder="0" className={`${inputClasses} pl-7`} />
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
              <input type="text" value={form.paidTo} onChange={set('paidTo')} maxLength={200} placeholder="e.g. Higginbothams" className={inputClasses} />
            </Field>
            <Field label="Reference / Transaction No." hint={form.paymentMode === 'cash' ? 'Optional for cash' : 'UTR, cheque or bill number'}>
              <input type="text" value={form.referenceNo} onChange={set('referenceNo')} maxLength={100} placeholder="e.g. UPI4521907733" className={inputClasses} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea value={form.notes} onChange={set('notes')} rows={2} maxLength={1000} placeholder="Any extra details (optional)" className={`${inputClasses} resize-none`} />
              </Field>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-text mb-2">Bill / Receipt</p>
            {bill || hasExistingBill ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-border px-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4.5 h-4.5 text-brand-navy shrink-0" />
                  <span className="text-sm text-brand-text truncate">{bill ? bill.name : expense.billFileName || 'Uploaded bill'}</span>
                  {!bill && (
                    <button type="button" onClick={() => onViewBill(expense.id)} className="text-xs font-semibold text-brand-navy hover:underline shrink-0">
                      View
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => (bill ? setBill(null) : setRemoveExistingBill(true))}
                  className="text-xs font-semibold text-brand-red hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-brand-border px-4 py-5 text-center cursor-pointer hover:border-brand-navy/50 hover:bg-brand-surface transition-colors">
                <Upload className="w-5 h-5 text-brand-muted" />
                <span className="text-sm font-medium text-brand-text">Click to upload bill</span>
                <span className="text-xs text-brand-muted">PDF, JPG or PNG up to 1MB (optional)</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  onChange={(e) => {
                    pickBill(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
              </label>
            )}
            {errors.bill && <p className="text-xs text-brand-red mt-1.5">{errors.bill}</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-brand-border bg-brand-surface/60 rounded-b-xl">
          {submitError && <p className="text-xs text-brand-red mb-3 text-right">{submitError}</p>}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-muted hover:bg-white transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving || addingCategory} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 transition-all disabled:opacity-50">
              {saving ? 'Saving…' : expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
