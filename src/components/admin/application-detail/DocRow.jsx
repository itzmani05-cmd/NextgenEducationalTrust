import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { getSignedDocumentUrl, AuthError } from '../../../utils/adminApi.js'
import { enOnly } from '../../../i18n/bilingual.js'

export default function DocRow({ label, docKey, hasFile, appId, token, logout }) {
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

  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-border last:border-0 gap-4">
      <span className="text-sm text-brand-muted">{label}</span>
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
        <span className="text-xs text-brand-muted">{enOnly('admin.common.notUploaded')}</span>
      )}
    </div>
  )
}
