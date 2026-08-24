import { Download, CheckCircle2, XCircle } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

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
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-text">{selectedDocMeta ? enOnly(selectedDocMeta.labelKey) : ''}</h3>
        {signedUrl && (
          <a
            href={signedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
          >
            <Download className="w-4 h-4" /> {enOnly('admin.verification.download')}
          </a>
        )}
      </div>

      <div className=" border border-brand-border rounded-xl h-80 flex items-center justify-center mb-6">
        {!selectedDocHasFile && (
          <p className="text-sm text-brand-muted">{enOnly('admin.verification.documentNotUploaded')}</p>
        )}
        {selectedDocHasFile && signedUrlLoading && (
          <p className="text-sm text-brand-muted">{enOnly('admin.verification.loadingDocument')}</p>
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

      <label className="block mb-4">
        <span className="block text-sm font-medium text-brand-text mb-1.5">
          {enOnly('admin.verification.reviewerComments')}
        </span>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={1}
          placeholder={enOnly('admin.verification.reviewerCommentsPlaceholder')}
          className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
        />
      </label>

      {selectedReview?.status && selectedReview.status !== 'pending' && (
        <p className="text-xs text-brand-muted mb-4">
          {enOnly('admin.verification.currentlyMarked')} <span className="font-semibold">{selectedReview.status}</span>.
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onReview('rejected')}
          disabled={saving}
          className="inline-flex items-center gap-2 border border-brand-red text-brand-red px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40"
        >
          <XCircle className="w-4 h-4" /> {enOnly('admin.verification.rejectDocument')}
        </button>
        <button
          type="button"
          onClick={() => onReview('approved')}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
        >
          <CheckCircle2 className="w-4 h-4" /> {enOnly('admin.verification.approveDocument')}
        </button>
      </div>
    </div>
  )
}
