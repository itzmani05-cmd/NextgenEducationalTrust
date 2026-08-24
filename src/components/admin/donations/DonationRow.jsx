import { useState } from 'react'
import { Check, XCircle, ExternalLink } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'
import StatusBadge from '../StatusBadge.jsx'

export default function DonationRow({ donation, onVerify, onReject, onViewReceipt }) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [receiptLoading, setReceiptLoading] = useState(false)

  const handleViewReceipt = async () => {
    setReceiptLoading(true)
    try {
      await onViewReceipt(donation.id)
    } finally {
      setReceiptLoading(false)
    }
  }

  const handleVerify = async () => {
    setBusy(true)
    setError('')
    try {
      await onVerify(donation.id)
    } catch (err) {
      setError(err.message || enOnly('admin.donations.updateFailed'))
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      setError(enOnly('admin.donations.rejectRequiresReason'))
      return
    }
    setBusy(true)
    setError('')
    try {
      await onReject(donation.id, reason.trim())
      setShowRejectForm(false)
      setReason('')
    } catch (err) {
      setError(err.message || enOnly('admin.donations.updateFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors align-top">
      <td className="px-5 py-3">
        <div className="font-medium text-brand-text">{donation.fullName}</div>
      </td>
      <td className="px-5 py-3 text-brand-text">
        <div>{donation.mobile}</div>
        <div className="text-xs text-brand-muted">{donation.email}</div>
      </td>
      <td className="px-5 py-3 text-brand-text font-semibold">₹{donation.amount.toLocaleString('en-IN')}</td>
      <td className="px-5 py-3 text-brand-text">{donation.purpose}</td>
      <td className="px-5 py-3 text-brand-muted">{donation.pan || enOnly('admin.common.dash')}</td>
      <td className="px-5 py-3 text-brand-muted">{donation.transactionRef}</td>
      <td className="px-5 py-3 text-brand-muted">
        {new Date(donation.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="px-5 py-3">
        <StatusBadge status={donation.status} />
        {donation.status === 'rejected' && donation.rejectionReason && (
          <p className="text-xs text-brand-red mt-1 max-w-[14rem]">
            {enOnly('admin.donations.previouslyRejected')} &ldquo;{donation.rejectionReason}&rdquo;
          </p>
        )}
      </td>
      <td className="px-5 py-3">
        {donation.status === 'pending' && (
          <div>
            {!showRejectForm ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" /> {enOnly('admin.donations.verify')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 border border-brand-red text-brand-red px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <XCircle className="w-3.5 h-3.5" /> {enOnly('admin.donations.reject')}
                </button>
              </div>
            ) : (
              <div className="w-56">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder={enOnly('admin.donations.rejectionReasonPlaceholder')}
                  className="w-full rounded-lg border border-brand-border px-2.5 py-1.5 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none mb-2"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={busy}
                    className="bg-brand-red text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-redDark transition-colors disabled:opacity-40"
                  >
                    {enOnly('admin.donations.confirmRejection')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectForm(false)
                      setError('')
                    }}
                    className="text-xs font-semibold text-brand-muted hover:text-brand-text"
                  >
                    {enOnly('admin.common.cancel')}
                  </button>
                </div>
              </div>
            )}
            {error && <p className="text-xs text-brand-red mt-1.5 max-w-[14rem]">{error}</p>}
          </div>
        )}
        {donation.status !== 'pending' && donation.verifiedByEmail && (
          <p className="text-xs text-brand-muted">
            {enOnly('admin.donations.verifiedBy')} {donation.verifiedByEmail}
          </p>
        )}
        {donation.status === 'verified' && donation.receiptPath && (
          <div className="mt-1.5">
            <button
              type="button"
              onClick={handleViewReceipt}
              disabled={receiptLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:underline disabled:opacity-50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {receiptLoading ? enOnly('admin.common.opening') : enOnly('admin.donations.viewReceipt')}
            </button>
            <p className={`text-xs mt-1 ${donation.receiptEmailSentAt ? 'text-green-700' : 'text-brand-amber'}`}>
              {donation.receiptEmailSentAt
                ? enOnly('admin.donations.receiptEmailSent')
                : enOnly('admin.donations.receiptEmailPending')}
            </p>
          </div>
        )}
      </td>
    </tr>
  )
}
