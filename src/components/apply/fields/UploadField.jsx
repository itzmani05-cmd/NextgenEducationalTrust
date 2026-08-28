import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import DocStatusChip from './DocStatusChip.jsx'
import { bi } from '../../../i18n/bilingual.js'

const MAX_FILE_SIZE = 1024 * 1024 // 1MB — must match the server's multer limit (server/src/routes/applications.js)

export default function UploadField({ label, file, onChange, required, helper, status, accept }) {
  const inputRef = useRef(null)
  const [fileError, setFileError] = useState('')
  const computedStatus = status || (file ? 'uploaded' : 'missing')

  const handleFileChange = (selected) => {
    if (selected && accept && !accept.includes(selected.type)) {
      setFileError('Only PNG or JPEG images are allowed.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (selected && selected.size > MAX_FILE_SIZE) {
      setFileError('File is too large — the maximum size is 1MB.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    setFileError('')
    onChange(selected)
  }

  return (
    <div className="border border-brand-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="apply-q text-sm font-medium text-brand-text truncate">
          {label} {required && <span className="text-brand-red">*</span>}
        </p>
        <p className="text-xs text-brand-muted truncate mt-0.5">
          {file ? file.name : helper || bi('common.uploadHelperDefault')}
        </p>
        {file && computedStatus === 'uploaded' && (
          <p className="text-xs text-brand-muted mt-0.5">{bi('common.awaitingVerification')}</p>
        )}
        {fileError && <p className="text-xs text-brand-red mt-0.5">{fileError}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
        <DocStatusChip status={computedStatus} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy border border-brand-navy px-3 py-1.5 rounded-lg hover:bg-brand-surface transition-colors whitespace-nowrap"
        >
          <Upload className="w-4 h-4" />
          {file ? bi('common.replaceBtn') : bi('common.uploadBtn')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept?.join(',')}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  )
}
