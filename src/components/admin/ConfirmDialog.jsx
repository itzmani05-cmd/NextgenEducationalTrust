import { useEffect } from 'react'

// Centered modal replacement for window.confirm() — the native browser
// dialog doesn't match the app's UI and (depending on OS/browser) doesn't
// even render centered on the page. Controlled by a single piece of state
// on the caller: null when closed, or { message, onConfirm, tone } when open.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'default', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title || message}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
      >
        {title && <h3 className="font-bold text-brand-text mb-2">{title}</h3>}
        <p className="text-sm text-brand-muted leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-muted hover:bg-brand-surface transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
              tone === 'danger' ? 'bg-brand-red hover:bg-brand-redDark' : 'bg-brand-navy hover:brightness-110'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
