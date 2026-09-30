import { useEffect, useState } from 'react'
import { X, Plus, Pencil, Trash2 } from 'lucide-react'
import { getIconStyle } from './expenseConstants.js'
import CategoryForm from './CategoryForm.jsx'

export default function ManageCategoriesModal({ open, categories, onClose, onCreate, onUpdate, onDelete }) {
  // null | 'new' | <category id> — which row is currently in edit mode.
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setEditing(null)
    setError('')
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleDelete = async (category) => {
    setDeletingId(category.id)
    setError('')
    try {
      await onDelete(category.id)
    } catch (err) {
      setError(err.message || 'Failed to delete category.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Manage categories"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-xl shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-brand-border">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Expense Categories</h2>
            <p className="text-xs text-brand-muted mt-0.5">Add, rename or remove categories. A category in use can&rsquo;t be deleted.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-text" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-3">
          {editing === 'new' ? (
            <CategoryForm
              submitLabel="Add Category"
              onSubmit={async (data) => {
                await onCreate(data)
                setEditing(null)
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing('new')}
              className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-border px-3 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand-navy/50 hover:bg-brand-surface transition-colors"
            >
              <Plus className="w-4 h-4" /> New Category
            </button>
          )}

          {error && <p className="text-xs text-brand-red">{error}</p>}

          <ul className="divide-y divide-brand-border border border-brand-border rounded-lg">
            {categories.map((c) => {
              if (editing === c.id) {
                return (
                  <li key={c.id} className="p-2">
                    <CategoryForm
                      initial={c}
                      submitLabel="Save"
                      onSubmit={async (data) => {
                        await onUpdate(c.id, data)
                        setEditing(null)
                      }}
                      onCancel={() => setEditing(null)}
                    />
                  </li>
                )
              }
              const { icon: Icon, accent } = getIconStyle(c.icon)
              const inUse = c.expenseCount > 0
              return (
                <li key={c.id} className="flex items-center gap-3 px-3.5 py-2.5">
                  <span className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${accent}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text truncate">{c.name}</p>
                    <p className="text-xs text-brand-muted">
                      {c.expenseCount} {c.expenseCount === 1 ? 'expense' : 'expenses'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(c.id)}
                    className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-navy"
                    aria-label={`Edit ${c.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    disabled={inUse || deletingId === c.id}
                    title={inUse ? 'In use — cannot delete' : 'Delete'}
                    className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-red disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-muted"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-brand-border bg-brand-surface/60 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
