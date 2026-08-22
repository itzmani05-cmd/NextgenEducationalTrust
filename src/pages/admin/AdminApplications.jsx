import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import StatusBadge from '../../components/admin/StatusBadge.jsx'

const FILTERS = [
  { value: '', labelKey: 'admin.applications.filterAll' },
  { value: 'submitted', labelKey: 'admin.applications.filterSubmitted' },
  { value: 'under_review', labelKey: 'admin.applications.filterUnderReview' },
  { value: 'approved', labelKey: 'admin.applications.filterApproved' },
  { value: 'rejected', labelKey: 'admin.applications.filterRejected' },
  { value: 'payment_submitted', labelKey: 'admin.applications.filterPaymentSubmitted' },
  { value: 'payment_approved', labelKey: 'admin.applications.filterPaymentApproved' },
  { value: 'payment_rejected', labelKey: 'admin.applications.filterPaymentRejected' },
  { value: 'certificate_issued', labelKey: 'admin.applications.filterCertificateIssued' },
]

export default function AdminApplications() {
  const { token, logout } = useAdminAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

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

  const setStatusFilter = (value) => {
    setSearchParams(value ? { status: value } : {})
  }

  const filtered = applications.filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    // Reference number shown to applicants is "NGC-" + the first 8 chars of
    // the id (see Apply.jsx / StatusCheck.jsx) — match on that, on the bare
    // 8-char code, or on a pasted full id.
    const ref = `ngc-${a.id.slice(0, 8)}`.toLowerCase()
    return (
      a.fullName?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.mobile?.toLowerCase().includes(q) ||
      a.district?.toLowerCase().includes(q) ||
      ref.includes(q) ||
      a.id.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">{enOnly('admin.applications.title')}</h1>
        <p className="text-brand-muted text-sm">
          {loading
            ? enOnly('admin.common.loading')
            : `${filtered.length} ${filtered.length === 1 ? enOnly('admin.applications.applicationWord') : enOnly('admin.applications.applicationWordPlural')}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                statusFilter === f.value
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-text border-brand-border hover:border-brand-navy'
              }`}
            >
              {enOnly(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={enOnly('admin.applications.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-left text-xs text-brand-muted uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colName')}</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colContact')}</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colDistrict')}</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colSubmitted')}</th>
                <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-brand-muted">
                    {enOnly('admin.applications.noApplicationsFound')}
                  </td>
                </tr>
              )}
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/applications/${app.id}`} className="font-medium text-brand-navy hover:underline">
                      {app.fullName || enOnly('admin.common.dash')}
                    </Link>
                    <div className="text-xs text-brand-muted">NGC-{app.id.slice(0, 8).toUpperCase()}</div>
                  </td>
                  <td className="px-5 py-3 text-brand-text">
                    <div>{app.mobile}</div>
                    <div className="text-xs text-brand-muted">{app.email}</div>
                  </td>
                  <td className="px-5 py-3 text-brand-text">{app.district || enOnly('admin.common.dash')}</td>
                  <td className="px-5 py-3 text-brand-muted">
                    {new Date(app.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
