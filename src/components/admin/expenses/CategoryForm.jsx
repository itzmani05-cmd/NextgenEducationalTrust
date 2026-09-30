import { useState } from 'react'
import { CATEGORY_ICONS } from './expenseConstants.js'

// Name + icon picker, shared by the Manage Categories dialog and the inline
// "New category" option inside the Add Expense form. Plain div (not <form>)
// because it can be nested inside the expense form.
export default function CategoryForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [icon, setIcon] = useState(initial?.icon || 'other')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!name.trim()) {
      setError('Enter a category name.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSubmit({ name: name.trim(), icon })
    } catch (err) {
      setError(err.message || 'Failed to save category.')
      setBusy(false)
    }
  }

  return (
    <div className="rounded-lg border border-brand-navy/30 bg-blue-50/30 p-3.5 space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submit()
          }
        }}
        maxLength={60}
        autoFocus
        placeholder="Category name, e.g. Medical Aid"
        className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
      />
      <div>
        <p className="text-xs font-semibold text-brand-muted mb-1.5">Icon</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_ICONS.map(({ key, icon: Icon, accent }) => (
            <button
              key={key}
              type="button"
              onClick={() => setIcon(key)}
              aria-pressed={icon === key}
              aria-label={key.replace(/_/g, ' ')}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${accent} ${
                icon === key ? 'ring-2 ring-brand-navy ring-offset-1' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-brand-red">{error}</p>}
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-muted hover:bg-white">
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-navy hover:brightness-110 disabled:opacity-50"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </div>
  )
}
