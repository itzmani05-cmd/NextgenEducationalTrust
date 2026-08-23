import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listDonations, updateDonationStatus, getDonationReceiptSignedUrl, AuthError } from '../../utils/adminApi.js'
import { enOnly } from '../../i18n/bilingual.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import DonationsFiltersBar from '../../components/admin/donations/DonationsFiltersBar.jsx'
import DonationsTable from '../../components/admin/donations/DonationsTable.jsx'

export default function AdminDonations() {
  const { token, logout } = useAdminAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  const [donations, setDonations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    listDonations(token)
      .then((data) => !cancelled && setDonations(data))
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setError(err.message || enOnly('admin.donations.loadFailed'))
      })
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [token, logout])

  const setStatusFilter = (value) => {
    setSearchParams(value ? { status: value } : {})
  }

  const updateLocal = (id, patch) => {
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  const handleVerify = async (id) => {
    const updated = await updateDonationStatus(token, id, 'verified')
    updateLocal(id, updated)
  }

  const handleReject = async (id, reason) => {
    const updated = await updateDonationStatus(token, id, 'rejected', reason)
    updateLocal(id, updated)
  }

  const handleViewReceipt = async (id) => {
    try {
      const { url } = await getDonationReceiptSignedUrl(token, id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to open receipt.')
    }
  }

  const filtered = donations.filter((d) => {
    if (statusFilter && d.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return (
      d.fullName?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.mobile?.toLowerCase().includes(q) ||
      d.transactionRef?.toLowerCase().includes(q)
    )
  })

  const totalVerified = donations
    .filter((d) => d.status === 'verified')
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">{enOnly('admin.donations.title')}</h1>
          <p className="text-brand-muted text-sm">
            {loading
              ? enOnly('admin.common.loading')
              : `${filtered.length} ${filtered.length === 1 ? enOnly('admin.donations.donationWord') : enOnly('admin.donations.donationWordPlural')}`}
          </p>
        </div>
        {!loading && (
          <div className="text-right">
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-muted">{enOnly('admin.donations.totalVerified')}</p>
            <p className="text-xl font-bold text-green-700">₹{totalVerified.toLocaleString('en-IN')}</p>
          </div>
        )}
      </div>

      <DonationsFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
      />

      <ErrorBanner message={error} />

      <DonationsTable
        donations={filtered}
        loading={loading}
        onVerify={handleVerify}
        onReject={handleReject}
        onViewReceipt={handleViewReceipt}
      />
    </div>
  )
}
