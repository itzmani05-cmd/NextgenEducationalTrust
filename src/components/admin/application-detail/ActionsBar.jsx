import { Link } from 'react-router-dom'
import { Check, Trash2 } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

export default function ActionsBar({
  appId,
  verificationComplete,
  reviewedCount,
  docsCount,
  updating,
  acceptedOrBeyond,
  onAccept,
  onDelete,
}) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-brand-text mr-2">{enOnly('admin.detail.actions')}</span>
      {verificationComplete ? (
        <button
          type="button"
          disabled={updating || acceptedOrBeyond}
          onClick={onAccept}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" /> {enOnly('admin.detail.accept')}
        </button>
      ) : (
        <Link
          to={`/admin/verification/${appId}`}
          className="text-sm text-brand-muted hover:text-brand-navy hover:underline"
        >
          {enOnly('admin.detail.completeVerificationPrompt')} ({reviewedCount}/{docsCount}) {enOnly('admin.detail.toAcceptApplication')}
        </Link>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-2 bg-white border border-brand-red text-brand-red px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> {enOnly('admin.detail.remove')}
      </button>
    </div>
  )
}
