import { User } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

const INCOME_LABEL_KEYS = {
  upto_1_5: 'step2.incomeTier1',
  '1_5_to_3': 'step2.incomeTier2',
  '3_to_5': 'step2.incomeTier3',
  above_5: 'step2.incomeTier4',
}

export default function ApplicantSummaryCard({ app, avatarUrl }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center mx-auto mb-2 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <User className="w-9 h-9" />
        )}
      </div>
      <h2 className="font-bold text-brand-text text-lg">{app.fullName}
        <span className="text-xs text-brand-muted"> - APP-{app.id.slice(0, 8).toUpperCase()}</span>
      </h2>

      <div className="text-left space-y-3 pt-4 border-t border-brand-border">
        <div>
          <p className="text-xs text-brand-muted">{enOnly('admin.verification.course')}</p>
          <p className="text-sm font-medium text-brand-text">{app.college?.degree || enOnly('admin.common.dash')}</p>
        </div>
        <div>
          <p className="text-xs text-brand-muted">{enOnly('admin.verification.institution')}</p>
          <p className="text-sm font-medium text-brand-text">{app.college?.name || enOnly('admin.common.dash')}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">{enOnly('admin.verification.annualIncome')}</p>
          <p className="text-sm font-medium text-brand-text">
            {INCOME_LABEL_KEYS[app.annualIncome] ? enOnly(INCOME_LABEL_KEYS[app.annualIncome]) : enOnly('admin.common.dash')}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-muted">{enOnly('admin.verification.submissionDate')}</p>
          <p className="text-sm font-medium text-brand-text">
            {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
