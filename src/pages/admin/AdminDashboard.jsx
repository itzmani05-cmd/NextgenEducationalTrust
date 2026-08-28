import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, Inbox, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, AuthError } from '../../utils/adminApi.js'
import StatusBadge from '../../components/admin/StatusBadge.jsx'

const STAT_CARDS = [
  { value: '', label: 'Total Applications', icon: Users, accent: 'text-brand-navy bg-brand-surface' },
  { value: 'submitted', label: 'Submitted', icon: Inbox, accent: 'text-brand-navy bg-brand-surface' },
  { value: 'under_review', label: 'Under Review', icon: Clock, accent: 'text-brand-amber bg-amber-50' },
  { value: 'approved', label: 'Approved', icon: CheckCircle2, accent: 'text-green-700 bg-green-50' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, accent: 'text-brand-red bg-red-50' },
]

export default function AdminDashboard() {
  const { token, logout } = useAdminAuth()
  const [applications, setApplications] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    listApplications(token)
      .then((data) => {
        if (!cancelled) setApplications(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setError(err.message || 'Failed to load applications.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, logout])

  const counts = useMemo(() => {
    const c = { '': applications.length, submitted: 0, under_review: 0, approved: 0, rejected: 0 }
    for (const app of applications) {
      if (c[app.status] !== undefined) c[app.status] += 1
    }
    return c
  }, [applications])

  const filtered = applications.filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      a.fullName?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.mobile?.toLowerCase().includes(q) ||
      a.district?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">Admin Dashboard</h1>
        <p className="text-brand-muted text-sm">Overview of scholarship applications received.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map(({ value, label, icon: Icon, accent }) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={`text-left bg-white border rounded-xl p-5 transition-colors ${
              statusFilter === value
                ? 'border-brand-navy ring-2 ring-brand-navy/20'
                : 'border-brand-border hover:border-brand-navy/50'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-bold text-brand-text">{loading ? '—' : counts[value]}</p>
            <p className="text-xs text-brand-muted mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <p className="text-brand-muted text-sm">
          {loading ? 'Loading…' : `Showing ${filtered.length} of ${applications.length} application${applications.length === 1 ? '' : 's'}`}
        </p>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-brand-border pl-9 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
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
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">District</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-brand-muted">
                    No applications found.
                  </td>
                </tr>
              )}
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/applications/${app.id}`} className="font-medium text-brand-navy hover:underline">
                      {app.fullName || '—'}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-text">
                    <div>{app.mobile}</div>
                    <div className="text-xs text-brand-muted">{app.email}</div>
                  </td>
                  <td className="px-5 py-3 text-brand-text">{app.district || '—'}</td>
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
