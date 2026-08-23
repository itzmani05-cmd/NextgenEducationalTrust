import { enOnly } from '../../i18n/bilingual.js'

const STATUS_STYLES = {
  submitted: { labelKey: 'admin.status.submitted', className: 'bg-brand-surface text-brand-navy' },
  under_review: { labelKey: 'admin.status.underReview', className: 'bg-amber-50 text-brand-amber' },
  approved: { labelKey: 'admin.status.approved', className: 'bg-green-50 text-green-700' },
  rejected: { labelKey: 'admin.status.rejected', className: 'bg-red-50 text-brand-red' },
  payment_submitted: { labelKey: 'admin.status.paymentSubmitted', className: 'bg-amber-50 text-brand-amber' },
  payment_approved: { labelKey: 'admin.status.paymentApproved', className: 'bg-green-50 text-green-700' },
  payment_rejected: { labelKey: 'admin.status.paymentRejected', className: 'bg-red-50 text-brand-red' },
  certificate_issued: { labelKey: 'admin.status.certificateIssued', className: 'bg-brand-navy/10 text-brand-navy' },
  pending: { labelKey: 'admin.status.pending', className: 'bg-amber-50 text-brand-amber' },
  verified: { labelKey: 'admin.status.verified', className: 'bg-green-50 text-green-700' },
}

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.submitted
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${s.className}`}>
      {enOnly(s.labelKey)}
    </span>
  )
}
