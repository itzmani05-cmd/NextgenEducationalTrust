import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, Upload, XCircle } from 'lucide-react'
import { uploadDocument } from '../../utils/api.js'
import { getAllRequiredDocuments } from '../../utils/documentChecklist.js'
import { bi } from '../../i18n/bilingual.js'

function docState(app, key) {
  const review = app.documentReviews?.[key]
  if (review?.status === 'approved') return 'approved'
  if (review?.status === 'rejected') return 'rejected'
  if (app.documentPresence?.[key]) return 'pending'
  return 'missing'
}

function DocIcon({ state }) {
  if (state === 'approved') return <CheckCircle2 className="w-5 h-5 text-green-600" />
  if (state === 'rejected') return <XCircle className="w-5 h-5 text-brand-red" />
  if (state === 'pending') return <Clock className="w-5 h-5 text-brand-amber" />
  return <AlertCircle className="w-5 h-5 text-brand-muted" />
}

function DocRow({ app, doc, onReupload }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState('')
  const state = docState(app, doc.key)
  const review = app.documentReviews?.[doc.key]
  const needsAction = state === 'rejected' || state === 'missing'

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setLocalError('')
    try {
      await uploadDocument(app.id, doc.key, file)
      await onReupload()
    } catch (err) {
      setLocalError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border border-brand-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <DocIcon state={state} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-text">{bi(doc.labelKey)}</p>
            <p className="text-xs text-brand-muted mt-0.5">
              {state === 'approved' && 'Verified and accepted.'}
              {state === 'pending' && 'Uploaded — awaiting review.'}
              {state === 'missing' && 'Not uploaded yet.'}
              {state === 'rejected' && 'Rejected — please re-upload.'}
            </p>
            {state === 'rejected' && review?.comment && (
              <p className="text-xs text-brand-red mt-1">&ldquo;{review.comment}&rdquo;</p>
            )}
            {localError && <p className="text-xs text-brand-red mt-1">{localError}</p>}
          </div>
        </div>

        {needsAction && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy border border-brand-navy px-3 py-1.5 rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-40"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : state === 'rejected' ? 'Re-upload' : 'Upload'}
            </button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function DocumentsSection({ app, onReupload }) {
  const docs = getAllRequiredDocuments(app)
  const reviewedCount = docs.filter((d) => {
    const state = docState(app, d.key)
    return state === 'approved' || state === 'rejected'
  }).length

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-brand-text">Documents</h2>
        {docs.length > 0 && (
          <span className="text-xs font-medium text-brand-muted">
            {reviewedCount} of {docs.length} reviewed
          </span>
        )}
      </div>
      <div className="space-y-3">
        {docs.map((doc) => (
          <DocRow key={doc.key} app={app} doc={doc} onReupload={onReupload} />
        ))}
      </div>
    </div>
  )
}
