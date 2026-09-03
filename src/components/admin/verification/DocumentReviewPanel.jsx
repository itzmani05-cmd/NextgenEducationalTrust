import { Download, CheckCircle2, XCircle, FileWarning, Loader2 } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

const STATUS_BADGE = {
  approved: { icon: CheckCircle2, className: 'bg-green-50 text-green-700 ring-green-600/20' },
  rejected: { icon: XCircle, className: 'bg-red-50 text-brand-red ring-red-600/20' },
}

export default function DocumentReviewPanel({
  selectedDocMeta,
  signedUrl,
  signedUrlLoading,
  selectedDocHasFile,
  selectedDocIsPdf,
  comment,
  onCommentChange,
  selectedReview,
  saving,
  onReview,
}) {
  const badge = selectedReview?.status && STATUS_BADGE[selectedReview.status]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <h3 className="font-bold text-brand-text truncate">{selectedDocMeta ? enOnly(selectedDocMeta.labelKey) : ''}</h3>
          {badge && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset shrink-0 ${badge.className}`}>
              <badge.icon className="w-3 h-3" /> {selectedReview.status === 'approved' ? enOnly('admin.detail.docs.approved') : enOnly('admin.detail.docs.rejected')}
            </span>
          )}
        </div>
        {signedUrl && (
          <a
            href={signedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline shrink-0"
          >
            <Download className="w-4 h-4" /> {enOnly('admin.verification.download')}
          </a>
        )}
      </div>

      <div className="border border-brand-border rounded-xl h-80 flex items-center justify-center mb-6 bg-brand-surface/40 overflow-hidden">
        {!selectedDocHasFile && (
          <div className="flex flex-col items-center gap-2 text-brand-muted">
            <FileWarning className="w-8 h-8 opacity-60" />
            <p className="text-sm">{enOnly('admin.verification.documentNotUploaded')}</p>
          </div>
        )}
        {selectedDocHasFile && signedUrlLoading && (
          <div className="flex flex-col items-center gap-2 text-brand-muted">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">{enOnly('admin.verification.loadingDocument')}</p>
          </div>
        )}
        {selectedDocHasFile && !signedUrlLoading && signedUrl && selectedDocIsPdf && (
          <iframe src={signedUrl} title={selectedDocMeta ? enOnly(selectedDocMeta.labelKey) : 'Document preview'} className="w-full h-full rounded-lg" />
        )}
        {selectedDocHasFile && !signedUrlLoading && signedUrl && !selectedDocIsPdf && (
          <img src={signedUrl} alt="" className="max-h-full max-w-full object-contain rounded-lg" />
        )}
        {selectedDocHasFile && !signedUrlLoading && !signedUrl && (
          <p className="text-sm text-brand-red">{enOnly('admin.verification.loadDocFailed')}</p>
        )}
      </div>

      <label className="block mb-5">
        <span className="block text-sm font-medium text-brand-text mb-1.5">
          {enOnly('admin.verification.reviewerComments')}
        </span>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={2}
          placeholder={enOnly('admin.verification.reviewerCommentsPlaceholder')}
          className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-brand-border">
        <button
          type="button"
          onClick={() => onReview('rejected')}
          disabled={saving || !selectedDocHasFile}
          className="inline-flex items-center gap-2 border border-brand-red text-brand-red px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <XCircle className="w-4 h-4" /> {enOnly('admin.verification.rejectDocument')}
        </button>
        <button
          type="button"
          onClick={() => onReview('approved')}
          disabled={saving || !selectedDocHasFile}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" /> {enOnly('admin.verification.approveDocument')}
        </button>
      </div>
    </div>
  )
}
