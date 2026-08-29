import { useRef, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import DocStatusChip from './DocStatusChip.jsx'
import { bi } from '../../../i18n/bilingual.js'

const MAX_FILE_SIZE = 1024 * 1024 // 1MB — must match the server's multer limit (server/src/routes/applications.js)

// Uploads immediately on selection (one request per document) rather than
// staging the file locally for a later bulk submit — so a document already
// picked survives a page refresh instead of silently disappearing, since a
// raw File object can't be cached in localStorage. `fileName` is this
// session's just-picked file (for display only); `alreadyUploaded` reflects
// what the server already has on file, from before this page load.
export default function UploadField({
  label, fileName, alreadyUploaded, uploading, error, onChange, required, helper, accept,
}) {
  const inputRef = useRef(null)
  const [validationError, setValidationError] = useState('')
  const hasFile = Boolean(fileName) || alreadyUploaded
  const status = uploading ? 'uploading' : hasFile ? 'uploaded' : 'missing'
  const displayError = error || validationError

  const handleFileChange = (selected) => {
    if (!selected) return
    if (accept && !accept.includes(selected.type)) {
      setValidationError('Only PNG or JPEG images are allowed.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      setValidationError('File is too large — the maximum size is 1MB.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    setValidationError('')
    onChange(selected)
  }

  return (
    <div className="border border-brand-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="apply-q text-sm font-medium text-brand-text truncate">
          {label} {required && <span className="text-brand-red">*</span>}
        </p>
        <p className="text-xs text-brand-muted truncate mt-0.5">
          {uploading
            ? bi('common.uploading')
            : fileName || (alreadyUploaded ? bi('common.documentOnFile') : helper || bi('common.uploadHelperDefault'))}
        </p>
        {hasFile && status === 'uploaded' && !uploading && (
          <p className="text-xs text-brand-muted mt-0.5">{bi('common.awaitingVerification')}</p>
        )}
        {displayError && <p className="text-xs text-brand-red mt-0.5">{displayError}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
        <DocStatusChip status={status} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy border border-brand-navy px-3 py-1.5 rounded-lg hover:bg-brand-surface transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? bi('common.uploading') : hasFile ? bi('common.replaceBtn') : bi('common.uploadBtn')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept?.join(',')}
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  )
}
