import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const inputClasses =
  'w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base sm:text-sm text-brand-text placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors'

export default function StaffFormModal({ open, staff, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', hourlyRate: '', active: true })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(staff
      ? { name: staff.name, phone: staff.phone || '', email: staff.email || '', hourlyRate: String(staff.hourlyRate), active: staff.active }
      : { name: '', phone: '', email: '', hourlyRate: '', active: true })
    setError('')
    setSaving(false)
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, staff, onClose])

  if (!open) return null

  const set = (key, transform) => (e) => setForm((f) => ({ ...f, [key]: transform ? transform(e.target.value) : e.target.value }))
  const digits = (v) => v.replace(/\D/g, '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Enter the staff member’s name.')
    if (!(Number(form.hourlyRate) > 0)) return setError('Enter an hourly rate greater than 0.')
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, name: form.name.trim(), hourlyRate: Number(form.hourlyRate) })
    } catch (err) {
      setError(err.message || 'Failed to save.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4" onClick={() => !saving && onClose()} role="presentation">
      <form
        role="dialog"
        aria-modal="true"
        aria-label={staff ? 'Edit staff' : 'Add staff'}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-brand-border">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">{staff ? 'Edit Staff' : 'Add Staff'}</h2>
            <p className="text-xs text-brand-muted mt-0.5">
              {staff ? `${staff.staffCode} · Rate changes apply to hours approved from now on.` : 'A Staff ID and temporary password are created for them.'}
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-brand-text mb-1.5">Full Name <span className="text-brand-red">*</span></span>
            <input type="text" autoFocus value={form.name} onChange={set('name')} maxLength={120} className={inputClasses} />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-brand-text mb-1.5">Mobile</span>
              <input type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={set('phone', digits)} placeholder="10-digit mobile" className={inputClasses} />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-brand-text mb-1.5">Hourly Rate <span className="text-brand-red">*</span></span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">₹</span>
                <input type="text" inputMode="numeric" value={form.hourlyRate} onChange={set('hourlyRate', digits)} placeholder="0" className={`${inputClasses} pl-7 pr-12`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted text-xs">/ hour</span>
              </div>
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-semibold text-brand-text mb-1.5">Email</span>
            <input type="email" value={form.email} onChange={set('email')} maxLength={120} className={inputClasses} />
          </label>
          {staff && (
            <label className="flex items-start gap-3 rounded-lg border border-brand-border px-3 py-2.5 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="mt-0.5 accent-brand-navy" />
              <span className="text-sm">
                <span className="font-semibold text-brand-text">Active</span>
                <span className="block text-xs text-brand-muted">Inactive staff cannot sign in or log hours.</span>
              </span>
            </label>
          )}
        </div>

        <div className="px-6 py-4 border-t border-brand-border bg-brand-surface/60 rounded-b-xl">
          {error && <p className="text-xs text-brand-red mb-3 text-right">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-muted hover:bg-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 disabled:opacity-50">
              {saving ? 'Saving…' : staff ? 'Save Changes' : 'Create Staff'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
