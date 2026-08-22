import { Link } from 'react-router-dom'
import { Users, Inbox, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

const STAT_CARDS = [
  { value: '', labelKey: 'admin.analytics.totalApplications', icon: Users, accent: 'text-brand-navy bg-brand-surface' },
  { value: 'submitted', labelKey: 'admin.analytics.submitted', icon: Inbox, accent: 'text-brand-navy bg-brand-surface' },
  { value: 'under_review', labelKey: 'admin.analytics.underReview', icon: Clock, accent: 'text-brand-amber bg-amber-50' },
  { value: 'approved', labelKey: 'admin.analytics.approved', icon: CheckCircle2, accent: 'text-green-700 bg-green-50' },
  { value: 'rejected', labelKey: 'admin.analytics.rejected', icon: XCircle, accent: 'text-brand-red bg-red-50' },
]

export default function StatCardsGrid({ counts, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {STAT_CARDS.map(({ value, labelKey, icon: Icon, accent }) => (
        <Link
          key={value || 'all'}
          to={value ? `/admin/applications?status=${value}` : '/admin/applications'}
          className="text-left bg-white border border-brand-border rounded-xl p-5 hover:border-brand-navy/50 transition-colors"
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <p className="text-2xl font-bold text-brand-text">{loading ? enOnly('admin.common.dash') : counts[value]}</p>
          <p className="text-xs text-brand-muted mt-0.5">{enOnly(labelKey)}</p>
        </Link>
      ))}
    </div>
  )
}
