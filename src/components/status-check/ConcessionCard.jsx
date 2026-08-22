import { Percent } from 'lucide-react'
import { CONCESSION_LABELS } from '../../utils/scholarshipCalc.js'

export default function ConcessionCard({ concession }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center shrink-0">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-wide mb-0.5">Scholarship Concession</p>
          <p className="font-semibold text-brand-text">
            {CONCESSION_LABELS[concession.category] || concession.category}
          </p>
        </div>
      </div>
      <span className="text-2xl font-extrabold text-brand-navy">{concession.percentage}%</span>
    </div>
  )
}
