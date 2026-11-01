import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listApplications, deleteApplication, downloadApplicationPdf, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import FiltersBar from '../../components/admin/applications/FiltersBar.jsx'
import ApplicationsTable from '../../components/admin/applications/ApplicationsTable.jsx'

const PAGE_SIZE = 30

export default function AdminApplications() {
  const { token, logout } = useAdminAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

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

  const handleDownload = async (app) => {
    setDownloadingId(app.id)
    setError('')
    try {
      const { blob, filename } = await downloadApplicationPdf(token, app.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to download the application.')
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDelete = async () => {
    const app = toDelete
    setToDelete(null)
    try {
      await deleteApplication(token, app.id)
      setApplications((prev) => prev.filter((a) => a.id !== app.id))
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to delete application.')
    }
  }

  const setStatusFilter = (value) => {
    setSearchParams(value ? { status: value } : {})
  }

  const filtered = applications.filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
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

  useEffect(() => setPage(1), [search, statusFilter])
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const offset = (currentPage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(offset, offset + PAGE_SIZE)

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

      <ApplicationsTable
        applications={pageRows}
        loading={loading}
        startIndex={offset}
        onDelete={setToDelete}
        onDownload={handleDownload}
        downloadingId={downloadingId}
        pagination={!loading && filtered.length > PAGE_SIZE ? { page: currentPage, pageSize: PAGE_SIZE, total: filtered.length, onPageChange: setPage } : null}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete application?"
        message={`Permanently delete the application from ${toDelete?.fullName || 'this applicant'}? This cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
