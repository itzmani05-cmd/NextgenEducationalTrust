import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import FiltersBar from '../../components/admin/applications/FiltersBar.jsx'
import ApplicationsTable from '../../components/admin/applications/ApplicationsTable.jsx'

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
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">{enOnly('admin.applications.title')}</h1>
        <p className="text-brand-muted text-sm">
          {loading
            ? enOnly('admin.common.loading')
            : `${filtered.length} ${filtered.length === 1 ? enOnly('admin.applications.applicationWord') : enOnly('admin.applications.applicationWordPlural')}`}
        </p>
      </div>

      <FiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
      />

      <ErrorBanner message={error} />

      <ApplicationsTable applications={filtered} loading={loading} />
    </div>
  )
}
