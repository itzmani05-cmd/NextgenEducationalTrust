import { useState } from 'react'
import { Upload, FileText, Eye, Trash2, Loader2, CheckCircle2, Plus } from 'lucide-react'
import { STAFF_DOCUMENT_KINDS, STAFF_DOCUMENT_MAX_BYTES, shrinkImage } from './staffConstants.js'

function DocumentRow({ doc, onView, onDelete, busy }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-brand-surface/70 px-3 py-2 text-sm">
      <FileText className="w-4 h-4 text-brand-navy shrink-0" />
      <span className="flex-1 truncate text-brand-text" title={doc.fileName}>{doc.fileName}</span>
      <button type="button" onClick={() => onView(doc.id)} className="p-1 rounded text-brand-muted hover:text-brand-navy" title="View" aria-label={`View ${doc.fileName}`}>
        <Eye className="w-4 h-4" />
      </button>
      {onDelete && (
        <button type="button" onClick={() => onDelete(doc)} disabled={busy} className="p-1 rounded text-brand-muted hover:text-brand-red disabled:opacity-50" title="Remove" aria-label={`Remove ${doc.fileName}`}>
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function UploadButton({ kind, label, onPick, busy }) {
  return (
    <label className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy cursor-pointer hover:border-brand-navy/60 hover:bg-brand-surface transition-colors ${busy ? 'pointer-events-none opacity-60' : ''}`}>
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : label.startsWith('Add') ? <Plus className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
      {busy ? 'Uploading…' : label}
      <input
        type="file"
        accept={kind.imageOnly ? '.jpg,.jpeg,.png,.webp' : '.pdf,.jpg,.jpeg,.png,.webp'}
        className="sr-only"
        onChange={(e) => {
          onPick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </label>
  )
}

export default function StaffDocumentsEditor({ documents, onUpload, onDelete, onView }) {
  const [busyKind, setBusyKind] = useState(null)
  const [errors, setErrors] = useState({})

  const run = async (kindKey, fn) => {
    setBusyKind(kindKey)
    setErrors((e) => ({ ...e, [kindKey]: '' }))
    try {
      await fn()
    } catch (err) {
      setErrors((e) => ({ ...e, [kindKey]: err.message || 'Something went wrong.' }))
    } finally {
      setBusyKind(null)
    }
  }

  const pick = (kind) => async (file) => {
    if (!file) return
    run(kind.key, async () => {
      const prepared = await shrinkImage(file)
      if (prepared.size > STAFF_DOCUMENT_MAX_BYTES) throw new Error('File is too large. The maximum size is 2MB.')
      await onUpload(kind.key, prepared)
    })
  }

  const remove = (kind) => (doc) => {
    if (!window.confirm(`Remove "${doc.fileName}"?`)) return
    run(kind.key, () => onDelete(doc.id))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {STAFF_DOCUMENT_KINDS.map((kind) => {
        const docs = documents.filter((d) => d.kind === kind.key)
        const done = docs.length > 0
        const busy = busyKind === kind.key
        return (
          <div key={kind.key} className={`rounded-xl border p-4 ${done ? 'border-green-200 bg-green-50/30' : 'border-brand-border'} ${kind.multiple ? 'md:col-span-2' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-brand-text flex items-center gap-1.5">
                  {done && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {kind.label}
                  {kind.required && <span className="text-brand-red">*</span>}
                </p>
                {kind.hint && <p className="text-xs text-brand-muted mt-0.5">{kind.hint}</p>}
              </div>
            </div>
            <div className="space-y-2">
              {docs.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} onView={onView} onDelete={remove(kind)} busy={busy} />
              ))}
              {(kind.multiple || !done) && (
                <UploadButton kind={kind} label={kind.multiple && done ? 'Add another' : 'Upload'} onPick={pick(kind)} busy={busy} />
              )}
              {!kind.multiple && done && (
                <UploadButton kind={kind} label="Replace" onPick={pick(kind)} busy={busy} />
              )}
            </div>
            {errors[kind.key] && <p className="text-xs text-brand-red mt-2">{errors[kind.key]}</p>}
          </div>
        )
      })}
    </div>
  )
}
