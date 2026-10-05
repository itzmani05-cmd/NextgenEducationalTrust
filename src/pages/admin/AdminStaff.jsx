import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Users, Hourglass, Wallet, Search, ChevronRight, UserRound } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { AuthError, createStaff, listPendingWorkLogs, listStaff, reviewWorkLog } from '../../utils/adminApi.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import Pagination from '../../components/admin/Pagination.jsx'
import StaffFormModal from '../../components/admin/staff/StaffFormModal.jsx'
import CredentialsDialog from '../../components/admin/staff/CredentialsDialog.jsx'
import WorkLogReviewActions from '../../components/admin/staff/WorkLogReviewActions.jsx'
import { formatINR } from '../../components/admin/expenses/expenseConstants.js'
import { formatMinutes, shortDate } from '../../components/staff/staffConstants.js'

const PAGE_SIZE = 10

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-xl font-bold text-brand-text tabular-nums">{value}</p>
      <p className="text-xs text-brand-muted mt-0.5">{label}{sub && <span className="text-brand-text font-medium"> · {sub}</span>}</p>
    </div>
  )
}

function CompletenessBar({ percent }) {
  return (
    <div className="flex items-center gap-2 min-w-[6rem]">
      <div className="h-1.5 flex-1 rounded-full bg-brand-border/60 overflow-hidden">
        <div className={`h-full rounded-full ${percent === 100 ? 'bg-green-600' : percent >= 50 ? 'bg-brand-navy' : 'bg-amber-500'}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-brand-muted tabular-nums w-8 text-right">{percent}%</span>
    </div>
  )
}

export default function AdminStaff() {
  const { token, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [staff, setStaff] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [page, setPage] = useState(1)
  const [adding, setAdding] = useState(false)
  const [credentials, setCredentials] = useState(null)

  const load = useCallback(() => {
    setError('')
    return Promise.all([listStaff(token), listPendingWorkLogs(token)])
      .then(([staffRows, pendingRows]) => {
        setStaff(staffRows)
        setPending(pendingRows)
      })
      .catch((err) => {
        if (err instanceof AuthError) return logout()
        setError(err.message || 'Failed to load staff.')
      })
  }, [token, logout])

  useEffect(() => {
    setLoading(true)
    load().finally(() => setLoading(false))
  }, [load])

  const closeAdd = useCallback(() => setAdding(false), [])

  const handleCreate = async (data) => {
    try {
      const { staff: created, tempPassword } = await createStaff(token, data)
      setStaff((prev) => [...prev, { ...created, completeness: 0, pendingCount: 0, pendingMinutes: 0, unpaidMinutes: 0, unpaidAmount: 0 }])
      setAdding(false)
      setCredentials({ title: 'Staff member created', name: created.name, staffCode: created.staffCode, tempPassword })
    } catch (err) {
      if (err instanceof AuthError) logout()
      throw err
    }
  }

  const handleReview = async (log, review) => {
    try {
      await reviewWorkLog(token, log.id, review)
    } catch (err) {
      if (err instanceof AuthError) logout()
      throw err
    }
    setPending((prev) => prev.filter((l) => l.id !== log.id))
    listStaff(token).then(setStaff).catch(() => {})
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return staff.filter((s) => {
      if (!showInactive && !s.active) return false
      if (!q) return true
      return s.name.toLowerCase().includes(q) || s.staffCode.toLowerCase().includes(q) || s.phone?.includes(q)
    })
  }, [staff, search, showInactive])

  useEffect(() => setPage(1), [search, showInactive])
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const activeCount = staff.filter((s) => s.active).length
  const pendingMinutes = pending.reduce((sum, l) => sum + l.minutes, 0)
  const unpaidAmount = staff.reduce((sum, s) => sum + s.unpaidAmount, 0)

  return (
    <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Staff</h1>
          <p className="text-brand-muted text-sm">Add staff, set hourly rates, approve logged hours and record payments.</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Active staff" value={loading ? '—' : activeCount} sub={!loading && staff.length > activeCount ? `${staff.length - activeCount} inactive` : ''} accent="bg-blue-50 text-brand-navy" />
        <StatCard icon={Hourglass} label="Hours awaiting approval" value={loading ? '—' : formatMinutes(pendingMinutes)} sub={!loading && pending.length ? `${pending.length} ${pending.length === 1 ? 'entry' : 'entries'}` : ''} accent="bg-amber-50 text-amber-700" />
        <StatCard icon={Wallet} label="Approved, not yet paid" value={loading ? '—' : formatINR(unpaidAmount)} accent="bg-red-50 text-brand-red" />
      </div>

      {pending.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-amber-200 bg-amber-50/60 flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold text-brand-text">Awaiting your approval</h2>
            <span className="text-xs text-brand-muted">({pending.length})</span>
          </div>
          <ul className="divide-y divide-brand-border max-h-[28rem] overflow-y-auto">
            {pending.map((log) => (
              <li key={log.id} className="px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link to={`/admin/staff/${log.staff.id}`} className="w-40 shrink-0 min-w-0 hover:underline">
                  <p className="text-sm font-semibold text-brand-text truncate">{log.staff.name}</p>
                  <p className="text-xs text-brand-muted font-mono">{log.staff.staffCode}</p>
                </Link>
                <div className="w-28 shrink-0">
                  <p className="text-sm text-brand-text">{shortDate(log.date)}</p>
                  <p className="text-xs text-brand-muted">{formatMinutes(log.minutes)} · ≈ {formatINR(Math.round((log.staff.hourlyRate * log.minutes) / 60))}</p>
                </div>
                <p className="flex-1 min-w-[12rem] text-sm text-brand-text">{log.description}</p>
                <WorkLogReviewActions log={log} onReview={handleReview} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, Staff ID or mobile…"
            className="w-full rounded-lg border border-brand-border bg-white pl-9 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-brand-muted cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="accent-brand-navy" />
          Show inactive staff
        </label>
      </div>

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-surface/70 border-b border-brand-border text-left text-[11px] text-brand-muted uppercase tracking-wider">
                <th className="pl-5 pr-3 py-3 font-semibold">Staff</th>
                <th className="px-3 py-3 font-semibold">Mobile</th>
                <th className="px-3 py-3 font-semibold text-right">Rate / hr</th>
                <th className="px-3 py-3 font-semibold">Profile</th>
                <th className="px-3 py-3 font-semibold text-right">Pending</th>
                <th className="px-3 py-3 font-semibold text-right">Unpaid</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="pl-3 pr-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-brand-muted">Loading staff…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <div className="mx-auto w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center mb-3">
                      <UserRound className="w-5 h-5 text-brand-muted" />
                    </div>
                    <p className="font-semibold text-brand-text">{staff.length ? 'No staff match your search' : 'No staff yet'}</p>
                    {!staff.length && (
                      <button type="button" onClick={() => setAdding(true)} className="mt-3 text-sm font-semibold text-brand-navy hover:underline">+ Add your first staff member</button>
                    )}
                  </td>
                </tr>
              )}
              {!loading && rows.map((s) => (
                <tr key={s.id} onClick={() => navigate(`/admin/staff/${s.id}`)} className="cursor-pointer hover:bg-brand-surface/60 transition-colors">
                  <td className="pl-5 pr-3 py-3.5">
                    <p className="font-semibold text-brand-text">{s.name}</p>
                    <p className="text-xs text-brand-muted font-mono">{s.staffCode}</p>
                  </td>
                  <td className="px-3 py-3.5 text-brand-text whitespace-nowrap">{s.phone || <span className="text-brand-muted">—</span>}</td>
                  <td className="px-3 py-3.5 text-right font-semibold text-brand-text tabular-nums whitespace-nowrap">{formatINR(s.hourlyRate)}</td>
                  <td className="px-3 py-3.5"><CompletenessBar percent={s.completeness} /></td>
                  <td className="px-3 py-3.5 text-right whitespace-nowrap tabular-nums">
                    {s.pendingCount ? <span className="font-semibold text-amber-700">{formatMinutes(s.pendingMinutes)}</span> : <span className="text-brand-muted">—</span>}
                  </td>
                  <td className="px-3 py-3.5 text-right whitespace-nowrap tabular-nums">
                    {s.unpaidAmount ? <span className="font-semibold text-brand-text">{formatINR(s.unpaidAmount)}</span> : <span className="text-brand-muted">—</span>}
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.active ? 'bg-green-50 text-green-700' : 'bg-brand-surface text-brand-muted'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                    {s.mustChangePassword && s.active && <p className="text-[11px] text-brand-muted mt-0.5">Not signed in yet</p>}
                  </td>
                  <td className="pl-3 pr-5 py-3.5 text-right"><ChevronRight className="w-4 h-4 text-brand-muted inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > PAGE_SIZE && (
          <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} itemLabel="staff" />
        )}
      </div>

      <StaffFormModal open={adding} staff={null} onClose={closeAdd} onSave={handleCreate} />
      <CredentialsDialog credentials={credentials} onClose={() => setCredentials(null)} />
    </div>
  )
}
