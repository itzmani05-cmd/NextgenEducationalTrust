import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { concessionAmount, examKey, formatINR, getExamMeta } from '../../components/admin/analytics/examConcession.js'

export default function AdminExamStudents() {
  const { examCategory } = useParams()
  const { token, logout } = useAdminAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listApplications(token)
      .then((data) => !cancelled && setApplications(data))
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setError(err.message || enOnly('admin.analytics.loadFailed'))
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token, logout])

  // Students with the biggest concession first; undecided ones at the end.
  const students = useMemo(
    () =>
      applications
        .filter((app) => examKey(app) === examCategory)
        .map((app) => ({ ...app, concession: concessionAmount(app) }))
        .sort((a, b) => (b.concession ?? -1) - (a.concession ?? -1) || a.fullName.localeCompare(b.fullName)),
    [applications, examCategory],
  )

  const meta = getExamMeta(examCategory, students[0]?.examName)
  const { icon: Icon, accent } = meta
  const dash = enOnly('admin.common.dash')

  const q = search.trim().toLowerCase()
  const visible = q
    ? students.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(q) ||
          s.mobile?.toLowerCase().includes(q) ||
          s.district?.toLowerCase().includes(q),
      )
    : students

  const withConcession = students.filter((s) => s.concession != null)
  const totalConcession = withConcession.reduce((sum, s) => sum + s.concession, 0)
  const visibleTotal = visible.reduce((sum, s) => sum + (s.concession || 0), 0)

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-10">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-navy mb-4">
        <ArrowLeft className="w-4 h-4" /> {enOnly('admin.analytics.backToDashboard')}
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">{meta.label}</h1>
            <p className="text-brand-muted text-sm">
              {loading ? enOnly('admin.common.loading') : `${students.length} ${enOnly('admin.analytics.students').toLowerCase()}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-brand-border rounded-xl px-5 py-3">
            <p className="text-xs text-brand-muted">{enOnly('admin.analytics.studentsWithConcession')}</p>
            <p className="text-xl font-bold text-brand-text">{loading ? dash : withConcession.length}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3">
            <p className="text-xs text-brand-muted">{enOnly('admin.analytics.totalConcession')}</p>
            <p className="text-xl font-bold text-green-700">{loading ? dash : formatINR(totalConcession)}</p>
          </div>
        </div>
      </div>

      <ErrorBanner message={error} />

      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={enOnly('admin.analytics.searchStudents')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-white pl-9 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-left text-xs text-brand-muted uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold w-12">#</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.analytics.colStudent')}</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.analytics.colDistrict')}</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.analytics.colStatus')}</th>
                <th className="px-5 py-3 font-semibold text-right">{enOnly('admin.analytics.colCourseFee')}</th>
                <th className="px-5 py-3 font-semibold text-right">{enOnly('admin.analytics.colConcessionPct')}</th>
                <th className="px-5 py-3 font-semibold text-right">{enOnly('admin.analytics.colConcessionAmount')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-brand-muted">{enOnly('admin.common.loading')}</td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-brand-muted">{enOnly('admin.analytics.noStudentsForExam')}</td>
                </tr>
              )}
              {!loading &&
                visible.map((s, i) => (
                  <tr key={s.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                    <td className="px-5 py-3 text-brand-muted">{i + 1}</td>
                    <td className="px-5 py-3">
                      <Link to={`/admin/applications/${s.id}`} className="font-medium text-brand-navy hover:underline">
                        {s.fullName || dash}
                      </Link>
                      <div className="text-xs text-brand-muted">{s.mobile}</div>
                    </td>
                    <td className="px-5 py-3 text-brand-muted">{s.district || dash}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3 text-right text-brand-text whitespace-nowrap">
                      {s.courseFee != null ? formatINR(s.courseFee) : dash}
                    </td>
                    <td className="px-5 py-3 text-right text-brand-text">
                      {s.concession != null ? `${s.finalApprovedConcession}%` : dash}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      {s.concession != null ? (
                        <span className="font-semibold text-green-700">{formatINR(s.concession)}</span>
                      ) : (
                        <span className="text-xs text-brand-muted">{enOnly('admin.analytics.concessionPending')}</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
            {!loading && visible.length > 0 && (
              <tfoot>
                <tr className="border-t border-brand-border bg-brand-surface">
                  <td colSpan={6} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    {enOnly('admin.analytics.total')} ({visible.length})
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-green-700 whitespace-nowrap">{formatINR(visibleTotal)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
