import { Check, ExternalLink, XCircle } from 'lucide-react'
import Row from './Row.jsx'
import { enOnly } from '../../../i18n/bilingual.js'

export default function PaymentVerificationSection({
  app,
  proofLoading,
  onViewProof,
  paymentError,
  paymentBusy,
  showRejectPaymentForm,
  onShowRejectForm,
  onCancelReject,
  rejectReason,
  onRejectReasonChange,
  onApprove,
  onReject,
}) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4">{enOnly('admin.detail.paymentVerification')}</h3>

      <div className="grid sm:grid-cols-2 gap-x-8">
        <div>
          <Row label={enOnly('admin.detail.originalFee')} value={app.courseFee != null ? `₹${app.courseFee.toLocaleString('en-IN')}` : null} />
          <Row label={enOnly('admin.detail.approvedConcession')} value={app.finalApprovedConcession != null ? `${app.finalApprovedConcession}%` : null} />
          <Row label={enOnly('admin.detail.finalPayableAmount')} value={app.payment.amountDue != null ? `₹${app.payment.amountDue.toLocaleString('en-IN')}` : null} />
          <Row label={enOnly('admin.detail.amountPaid')} value={app.payment.amountPaid != null ? `₹${app.payment.amountPaid.toLocaleString('en-IN')}` : null} />
        </div>
        <div>
          <Row label={enOnly('admin.detail.transactionId')} value={app.payment.transactionId} />
          <Row label={enOnly('admin.detail.paymentMethod')} value={app.payment.paymentMethod} />
          <Row
            label={enOnly('admin.detail.paymentDate')}
            value={app.payment.paymentDate ? new Date(app.payment.paymentDate).toLocaleDateString('en-IN') : null}
          />
          <Row
            label={enOnly('admin.detail.submittedOn')}
            value={app.payment.submittedAt ? new Date(app.payment.submittedAt).toLocaleString('en-IN') : null}
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-t border-brand-border mt-2 gap-4">
        <span className="text-sm text-brand-muted shrink-0">{enOnly('admin.detail.paymentProof')}</span>
        <button
          type="button"
          onClick={onViewProof}
          disabled={proofLoading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          <ExternalLink className="w-3.5 h-3.5" /> {proofLoading ? enOnly('admin.common.opening') : enOnly('admin.common.view')}
        </button>
      </div>

      {app.payment.status === 'rejected' && app.payment.rejectionReason && (
        <p className="text-sm text-brand-red mt-3">
          {enOnly('admin.detail.previouslyRejected')} &ldquo;{app.payment.rejectionReason}&rdquo;
        </p>
      )}

      {paymentError && <p className="text-sm text-brand-red mt-3">{paymentError}</p>}

      {app.payment.status === 'submitted' && (
        <div className="mt-4">
          {!showRejectPaymentForm ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onApprove}
                disabled={paymentBusy}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
              >
                <Check className="w-4 h-4" /> {enOnly('admin.detail.approvePayment')}
              </button>
              <button
                type="button"
                onClick={onShowRejectForm}
                disabled={paymentBusy}
                className="inline-flex items-center gap-2 border border-brand-red text-brand-red px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40"
              >
                <XCircle className="w-4 h-4" /> {enOnly('admin.detail.rejectPayment')}
              </button>
            </div>
          ) : (
            <div>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.detail.rejectionReason')}</span>
                <textarea
                  value={rejectReason}
                  onChange={(e) => onRejectReasonChange(e.target.value)}
                  rows={2}
                  placeholder={enOnly('admin.detail.rejectionReasonPlaceholder')}
                  className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReject}
                  disabled={paymentBusy}
                  className="inline-flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors disabled:opacity-40"
                >
                  {enOnly('admin.detail.confirmRejection')}
                </button>
                <button
                  type="button"
                  onClick={onCancelReject}
                  className="text-sm font-semibold text-brand-muted hover:text-brand-text"
                >
                  {enOnly('admin.common.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
