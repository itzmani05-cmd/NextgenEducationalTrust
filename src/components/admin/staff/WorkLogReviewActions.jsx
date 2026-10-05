import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function WorkLogReviewActions({ log, onReview }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (status) => {
    setBusy(true)
    setError('')
    try {
      await onReview(log, { status, rejectionReason: status === 'rejected' ? reason.trim() : undefined })
      setRejecting(false)
      setReason('')
    } catch (err) {
      setError(err.message || 'Failed.')
    } finally {
      setBusy(false)
    }
  }

  if (rejecting) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && reason.trim() && submit('rejected')}
            maxLength={300}
            placeholder="Reason for rejecting"
            className="w-44 rounded-lg border border-brand-border px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          />
          <button type="button" disabled={busy || !reason.trim()} onClick={() => submit('rejected')} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-red disabled:opacity-50">
            Reject
          </button>
          <button type="button" disabled={busy} onClick={() => setRejecting(false)} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface" aria-label="Cancel">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        {error && <p className="text-xs text-brand-red">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        {log.status !== 'approved' && (
          <button type="button" disabled={busy} onClick={() => submit('approved')} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
            <Check className="w-3.5 h-3.5" /> Approve
          </button>
        )}
        {log.status !== 'rejected' && (
          <button type="button" disabled={busy} onClick={() => setRejecting(true)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-red border border-brand-red/30 hover:bg-red-50 disabled:opacity-50">
            <X className="w-3.5 h-3.5" /> Reject
          </button>
        )}
      </div>
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  )
}
