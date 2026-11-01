import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CalendarCheck, LogIn, LogOut } from 'lucide-react'
import { checkInAttendance, checkOutAttendance, listMyAttendance } from '../../utils/staffApi.js'
import { currentMonth, formatMinutes, monthLabel, recentMonths, shortDate } from '../../components/staff/staffConstants.js'
import { staffInputClasses } from '../../components/staff/StaffAuthCard.jsx'

const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
const durationMinutes = (r) => (r.checkOutAt ? Math.max(0, Math.round((new Date(r.checkOutAt) - new Date(r.checkInAt)) / 60000)) : null)

export default function StaffAttendance() {
  const { token, guard } = useOutletContext()
  const [month, setMonth] = useState(currentMonth)
  const [records, setRecords] = useState([])
  const [today, setToday] = useState('')
  const [todayRecord, setTodayRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    guard(() => listMyAttendance(token, month))
      .then((res) => {
        if (cancelled) return
        setRecords(res.records)
        setToday(res.today)
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load your attendance.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token, month, guard])

  // Today's record may fall outside the selected month, so load it from the current month separately.
  useEffect(() => {
    guard(() => listMyAttendance(token, currentMonth()))
      .then((res) => setTodayRecord(res.records.find((r) => r.date === res.today) || null))
      .catch(() => {})
  }, [token, guard])

  const act = async (fn) => {
    setActing(true)
    setError('')
    try {
      const saved = await guard(() => fn(token))
      setTodayRecord(saved)
      if (saved.date.startsWith(month)) {
        setRecords((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)].sort((a, b) => b.date.localeCompare(a.date)))
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setActing(false)
    }
  }

  const totalMinutes = records.reduce((s, r) => s + (durationMinutes(r) || 0), 0)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Attendance</h1>
          <p className="text-sm text-brand-muted mt-0.5">Check in when you start and check out when you finish for the day.</p>
        </div>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${staffInputClasses} !w-auto`} aria-label="Month">
          {recentMonths().map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-brand-text uppercase tracking-wide flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> Today</h2>
          <p className="text-sm text-brand-muted mt-1">
            {!todayRecord && 'You have not checked in yet.'}
            {todayRecord && !todayRecord.checkOutAt && <>Checked in at <strong className="text-brand-text">{formatTime(todayRecord.checkInAt)}</strong></>}
            {todayRecord?.checkOutAt && <>In <strong className="text-brand-text">{formatTime(todayRecord.checkInAt)}</strong> · Out <strong className="text-brand-text">{formatTime(todayRecord.checkOutAt)}</strong></>}
          </p>
        </div>
        {!todayRecord && (
          <button type="button" disabled={acting} onClick={() => act(checkInAttendance)} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 disabled:opacity-50">
            <LogIn className="w-4 h-4" /> {acting ? 'Checking in…' : 'Check in'}
          </button>
        )}
        {todayRecord && !todayRecord.checkOutAt && (
          <button type="button" disabled={acting} onClick={() => act(checkOutAttendance)} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-red hover:brightness-110 disabled:opacity-50">
            <LogOut className="w-4 h-4" /> {acting ? 'Checking out…' : 'Check out'}
          </button>
        )}
        {todayRecord?.checkOutAt && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">Done for today</span>}
      </div>

      {error && <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>}

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-text">{monthLabel(month)}</h2>
          <span className="text-xs text-brand-muted">{records.length} {records.length === 1 ? 'day' : 'days'} present · {formatMinutes(totalMinutes)}</span>
        </div>
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">Loading…</p>
        ) : records.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">No attendance for {monthLabel(month)} yet.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {records.map((r) => {
              const mins = durationMinutes(r)
              return (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-4 text-sm">
                  <p className="font-semibold text-brand-text w-28 shrink-0">{shortDate(r.date)}</p>
                  <p className="flex-1 text-brand-muted">{formatTime(r.checkInAt)} – {r.checkOutAt ? formatTime(r.checkOutAt) : 'not checked out'}</p>
                  <p className="text-brand-text tabular-nums">{mins !== null ? formatMinutes(mins) : r.date === today ? 'In progress' : '—'}</p>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
