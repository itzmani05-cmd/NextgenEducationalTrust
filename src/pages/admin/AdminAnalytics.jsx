import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Inbox, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import StatusBadge from '../../components/admin/StatusBadge.jsx'

const STAT_CARDS = [
  { value: '', labelKey: 'admin.analytics.totalApplications', icon: Users, accent: 'text-brand-navy bg-brand-surface' },
  { value: 'submitted', labelKey: 'admin.analytics.submitted', icon: Inbox, accent: 'text-brand-navy bg-brand-surface' },
  { value: 'under_review', labelKey: 'admin.analytics.underReview', icon: Clock, accent: 'text-brand-amber bg-amber-50' },
  { value: 'approved', labelKey: 'admin.analytics.approved', icon: CheckCircle2, accent: 'text-green-700 bg-green-50' },
  { value: 'rejected', labelKey: 'admin.analytics.rejected', icon: XCircle, accent: 'text-brand-red bg-red-50' },
]

export default function AdminAnalytics() {
  const { token, logout } = useAdminAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
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

  const counts = useMemo(() => {
    const c = { '': applications.length, submitted: 0, under_review: 0, approved: 0, rejected: 0 }
    for (const app of applications) {
      if (c[app.status] !== undefined) c[app.status] += 1
    }
    return c
  }, [applications])

  const recent = applications.slice(0, 6)

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">{enOnly('admin.analytics.title')}</h1>
        <p className="text-brand-muted text-sm">{enOnly('admin.analytics.subtitle')}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">
          {error}
        </div>
      )}

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

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h2 className="font-semibold text-brand-text">{enOnly('admin.analytics.recentApplications')}</h2>
          <Link to="/admin/applications" className="text-sm font-semibold text-brand-navy hover:underline">
            {enOnly('admin.analytics.viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {!loading && recent.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-center text-brand-muted">{enOnly('admin.analytics.noApplicationsYet')}</td>
                </tr>
              )}
              {recent.map((app) => (
                <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/applications/${app.id}`} className="font-medium text-brand-navy hover:underline">
                      {app.fullName || enOnly('admin.common.dash')}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-brand-muted">{app.district || enOnly('admin.common.dash')}</td>
                  <td className="px-5 py-3 text-brand-muted">
                    {new Date(app.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
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
