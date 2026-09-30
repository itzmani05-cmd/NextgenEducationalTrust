import { Landmark, Building, Cpu, BookMarked } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

// Same exam options as the apply form (Step1Student). Listed here so every
// exam gets a card even before anyone has applied for it.
const KNOWN_EXAMS = [
  { examCategory: 'state_govt', labelKey: 'step1.courseStateGovt', icon: Landmark, accent: 'text-brand-navy bg-blue-50' },
  { examCategory: 'central_govt', labelKey: 'step1.courseCentralGovt', icon: Building, accent: 'text-teal-700 bg-teal-50' },
  { examCategory: 'gate', labelKey: 'step1.courseGate', icon: Cpu, accent: 'text-purple-700 bg-purple-50' },
]

const EMPTY_TOTALS = { students: 0, approved: 0, paid: 0, amountCollected: 0, concessionGiven: 0 }

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`

function buildRows(summary) {
  const byCategory = Object.fromEntries(summary.map((s) => [s.examCategory, s]))
  const known = KNOWN_EXAMS.map(({ examCategory, labelKey, icon, accent }) => ({
    ...EMPTY_TOTALS,
    ...byCategory[examCategory],
    examCategory,
    label: enOnly(labelKey),
    icon,
    accent,
  }))
  // Anything outside the known list (e.g. older data) still shows up.
  const extra = summary
    .filter((s) => !KNOWN_EXAMS.some((k) => k.examCategory === s.examCategory))
    .map((s) => ({ ...s, label: s.examName, icon: BookMarked, accent: 'text-brand-muted bg-brand-surface' }))
  return [...known, ...extra]
}

function Metric({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-brand-muted">{label}</span>
      <span className="font-semibold text-brand-text">{value}</span>
    </div>
  )
}

export default function ExamSummarySection({ summary, loading, error }) {
  const rows = buildRows(summary)
  const totals = rows.reduce(
    (acc, r) => Object.fromEntries(Object.keys(acc).map((k) => [k, acc[k] + (r[k] || 0)])),
    EMPTY_TOTALS,
  )
  const dash = enOnly('admin.common.dash')
  const show = (v) => (loading ? dash : v)

  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-brand-text">{enOnly('admin.analytics.examSummaryTitle')}</h2>
          <p className="text-xs text-brand-muted mt-0.5">{enOnly('admin.analytics.examSummarySubtitle')}</p>
        </div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <p className="text-xs text-brand-muted">{enOnly('admin.analytics.allExams')} · {enOnly('admin.analytics.students')}</p>
            <p className="text-lg font-bold text-brand-text">{show(totals.students)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-muted">{enOnly('admin.analytics.allExams')} · {enOnly('admin.analytics.amountCollected')}</p>
            <p className="text-lg font-bold text-green-700">{show(formatINR(totals.amountCollected))}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-brand-red mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(({ examCategory, label, icon: Icon, accent, students, approved, paid, amountCollected, concessionGiven }) => (
          <div key={examCategory} className="bg-white border border-brand-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="font-semibold text-brand-text truncate">{label}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-lg bg-brand-surface px-3 py-2.5">
                <p className="text-xs text-brand-muted">{enOnly('admin.analytics.students')}</p>
                <p className="text-xl font-bold text-brand-text">{show(students)}</p>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2.5">
                <p className="text-xs text-brand-muted">{enOnly('admin.analytics.amountCollected')}</p>
                <p className="text-xl font-bold text-green-700 truncate">{show(formatINR(amountCollected))}</p>
              </div>
            </div>

            <div className="divide-y divide-brand-border">
              <Metric label={enOnly('admin.analytics.concessionApproved')} value={show(approved)} />
              <Metric label={enOnly('admin.analytics.paidStudents')} value={show(paid)} />
              <Metric label={enOnly('admin.analytics.concessionGiven')} value={show(formatINR(concessionGiven))} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
