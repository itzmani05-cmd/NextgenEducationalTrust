import { useEffect, useState } from 'react'
import { formatMinutes, currentMonth, monthLabel, recentMonths, shortDate } from '../../staff/staffConstants.js'

const inputClasses =
  'rounded-lg border border-brand-border bg-white px-3 py-2 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy'

const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
const durationMinutes = (r) => (r.checkOutAt ? Math.max(0, Math.round((new Date(r.checkOutAt) - new Date(r.checkInAt)) / 60000)) : null)

export default function StaffAttendancePanel({ loadAttendance }) {
  const [month, setMonth] = useState(currentMonth)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    loadAttendance(month)
      .then((rows) => !cancelled && setRecords(rows))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load attendance.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [month, loadAttendance])

  const totalMinutes = records.reduce((s, r) => s + (durationMinutes(r) || 0), 0)
  const missingCheckout = records.filter((r) => !r.checkOutAt && r.date !== new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })).length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={inputClasses} aria-label="Month">
          {recentMonths().map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <p className="text-sm text-brand-muted">
          <strong className="text-brand-text">{records.length}</strong> {records.length === 1 ? 'day' : 'days'} present ·{' '}
          <strong className="text-brand-text">{formatMinutes(totalMinutes)}</strong> on site
          {missingCheckout > 0 && <span className="text-amber-700"> · {missingCheckout} without check-out</span>}
        </p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>}

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">Loading…</p>
        ) : records.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">No attendance recorded for {monthLabel(month)}.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {records.map((r) => {
              const mins = durationMinutes(r)
              return (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-4 text-sm">
                  <p className="font-semibold text-brand-text w-28 shrink-0">{shortDate(r.date)}</p>
                  <p className="flex-1 text-brand-muted">{formatTime(r.checkInAt)} – {r.checkOutAt ? formatTime(r.checkOutAt) : 'not checked out'}</p>
                  <p className="text-brand-text tabular-nums">{mins !== null ? formatMinutes(mins) : '—'}</p>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
