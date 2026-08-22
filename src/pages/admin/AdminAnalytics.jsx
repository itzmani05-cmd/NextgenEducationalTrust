import { useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import StatCardsGrid from '../../components/admin/analytics/StatCardsGrid.jsx'
import RecentApplicationsTable from '../../components/admin/analytics/RecentApplicationsTable.jsx'

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
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">{enOnly('admin.analytics.title')}</h1>
        <p className="text-brand-muted text-sm">{enOnly('admin.analytics.subtitle')}</p>
      </div>

      <ErrorBanner message={error} />

      <StatCardsGrid counts={counts} loading={loading} />

      <RecentApplicationsTable applications={recent} loading={loading} />
    </div>
  )
}
