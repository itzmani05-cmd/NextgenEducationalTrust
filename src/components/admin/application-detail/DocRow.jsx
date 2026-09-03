import { useState } from 'react'
import { ExternalLink, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { getSignedDocumentUrl, AuthError } from '../../../utils/adminApi.js'
import { enOnly } from '../../../i18n/bilingual.js'

const REVIEW_STATUS = {
  approved: { labelKey: 'admin.detail.docs.approved', icon: CheckCircle2, className: 'bg-green-50 text-green-700 ring-green-600/20' },
  rejected: { labelKey: 'admin.detail.docs.rejected', icon: XCircle, className: 'bg-red-50 text-brand-red ring-red-600/20' },
  pending: { labelKey: 'admin.detail.docs.pendingReview', icon: Clock, className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
}

export default function DocRow({ label, docKey, hasFile, reviewStatus, appId, token, logout }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleView = async () => {
    setLoading(true)
    setError(false)
    try {
      const { url } = await getSignedDocumentUrl(token, appId, docKey)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const status = hasFile ? REVIEW_STATUS[reviewStatus] || REVIEW_STATUS.pending : null

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-brand-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-lg ${
            hasFile ? 'bg-brand-navy/5 text-brand-navy' : 'bg-brand-surface text-brand-muted'
          }`}
        >
          <FileText className="w-4 h-4" />
        </span>
        <span className="text-sm font-medium text-brand-text truncate">{label}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {status && (
          <span
            className={`hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${status.className}`}
          >
            <status.icon className="w-3 h-3" /> {enOnly(status.labelKey)}
          </span>
        )}
        {hasFile ? (
          <button
            type="button"
            onClick={handleView}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {loading ? enOnly('admin.common.opening') : error ? enOnly('admin.common.retry') : enOnly('admin.common.view')}
          </button>
        ) : (
          <span className="text-xs text-brand-muted italic">{enOnly('admin.common.notUploaded')}</span>
        )}
      </div>
    </div>
  )
}
