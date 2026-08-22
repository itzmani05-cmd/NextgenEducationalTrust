import { ShieldCheck } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

export default function VerificationProgressCard({ reviewedCount, total, pct, allReviewed, saving, appStatus, onComplete }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-brand-navy" />
        <h3 className="font-semibold text-brand-text text-sm">{enOnly('admin.verification.verificationProgress')}</h3>
      </div>
      <div className="h-2 bg-brand-surface rounded-full overflow-hidden mb-2">
        <div className="h-full bg-brand-navy rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-brand-muted mb-4">
        <span>{reviewedCount} {enOnly('admin.verification.ofDocuments').replace('{total}', total)}</span>
        <span>{pct}%</span>
      </div>
      <button
        type="button"
        onClick={onComplete}
        disabled={!allReviewed || saving || appStatus === 'approved' || appStatus === 'rejected'}
        className="w-full bg-brand-navy text-white text-sm font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {appStatus === 'approved' || appStatus === 'rejected' ? enOnly('admin.verification.verificationComplete') : enOnly('admin.verification.completeVerification')}
      </button>
    </div>
  )
}
