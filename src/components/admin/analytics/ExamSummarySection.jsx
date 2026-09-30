import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'
import { formatINR, summarizeExams } from './examConcession.js'

export default function ExamSummarySection({ applications, loading }) {
  const rows = summarizeExams(applications)
  const totalConcession = rows.reduce((sum, r) => sum + r.totalConcession, 0)
  const show = (v) => (loading ? enOnly('admin.common.dash') : v)

  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-brand-text">{enOnly('admin.analytics.examSummaryTitle')}</h2>
          <p className="text-xs text-brand-muted mt-0.5">{enOnly('admin.analytics.examSummarySubtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-muted">{enOnly('admin.analytics.allExamsConcession')}</p>
          <p className="text-lg font-bold text-green-700">{show(formatINR(totalConcession))}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(({ examCategory, label, icon: Icon, accent, students, withConcession, totalConcession: amount }) => (
          <Link
            key={examCategory}
            to={`/admin/exams/${examCategory}`}
            className="group bg-white border border-brand-border rounded-xl p-5 hover:border-brand-navy/50 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="flex-1 font-semibold text-brand-text truncate">{label}</p>
              <ChevronRight className="w-4.5 h-4.5 text-brand-muted group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-brand-surface px-3 py-2.5">
                <p className="text-xs text-brand-muted">{enOnly('admin.analytics.students')}</p>
                <p className="text-xl font-bold text-brand-text">{show(students)}</p>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2.5">
                <p className="text-xs text-brand-muted">{enOnly('admin.analytics.totalConcession')}</p>
                <p className="text-xl font-bold text-green-700 truncate">{show(formatINR(amount))}</p>
              </div>
            </div>
            <p className="text-xs text-brand-muted mt-3">
              {show(withConcession)} {enOnly('admin.analytics.studentsWithConcession')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
