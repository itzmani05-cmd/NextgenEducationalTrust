import { bi } from '../../../i18n/bilingual.js'

const STATUS_KEYS = {
  missing: { key: 'common.notUploaded', className: 'bg-gray-100 text-brand-muted' },
  uploaded: { key: 'common.uploaded', className: 'bg-brand-surface text-brand-navy' },
  pending: { key: 'common.pendingVerification', className: 'bg-amber-50 text-brand-amber' },
  verified: { key: 'common.verified', className: 'bg-green-50 text-green-700' },
  rejected: { key: 'common.rejected', className: 'bg-red-50 text-brand-red' },
  reupload: { key: 'common.reuploadRequired', className: 'bg-orange-50 text-orange-600' },
}

export default function DocStatusChip({ status }) {
  const s = STATUS_KEYS[status] || STATUS_KEYS.missing
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${s.className}`}>
      {bi(s.key)}
    </span>
  )
}
