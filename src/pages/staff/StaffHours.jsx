import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Clock, CheckCircle2, Hourglass, IndianRupee, Pencil, Trash2, Plus, Wallet } from 'lucide-react'
import { createMyWorkLog, deleteMyWorkLog, listMyPayouts, listMyWorkLogs, updateMyWorkLog } from '../../utils/staffApi.js'
import { WORK_LOG_STATUS, currentMonth, formatMinutes, monthLabel, recentMonths, shortDate, todayISO } from '../../components/staff/staffConstants.js'
import { formatExpenseDate, formatINR, getPaymentModeLabel } from '../../components/admin/expenses/expenseConstants.js'
import { staffInputClasses } from '../../components/staff/StaffAuthCard.jsx'

const HOUR_OPTIONS = Array.from({ length: 17 }, (_, i) => i)
const MINUTE_OPTIONS = [0, 15, 30, 45]
const EMPTY_FORM = { date: '', hours: '1', mins: '0', description: '' }

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${accent}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-lg font-bold text-brand-text tabular-nums">{value}</p>
      <p className="text-xs text-brand-muted">{label}{sub && <span className="text-brand-text font-medium"> · {sub}</span>}</p>
    </div>
  )
}

export default function StaffHours() {
  const { token, profile, guard } = useOutletContext()
  const [month, setMonth] = useState(currentMonth)
  const [logs, setLogs] = useState([])
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, date: todayISO() }))
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    guard(() => listMyWorkLogs(token, month))
      .then((rows) => !cancelled && setLogs(rows))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load your hours.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token, month, guard])

  useEffect(() => {
    guard(() => listMyPayouts(token)).then(setPayouts).catch(() => {})
  }, [token, guard])

  const counted = logs.filter((l) => l.status !== 'rejected')
  const approved = logs.filter((l) => l.status === 'approved')
  const pending = logs.filter((l) => l.status === 'pending')
  const sumMinutes = (rows) => rows.reduce((s, l) => s + l.minutes, 0)
  const approvedAmount = approved.reduce((s, l) => s + (l.amount || 0), 0)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const resetForm = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, date: todayISO() })
    setFormError('')
  }

  const startEdit = (log) => {
    setEditingId(log.id)
    setForm({ date: log.date, hours: String(Math.floor(log.minutes / 60)), mins: String(log.minutes % 60), description: log.description })
    setFormError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const minutes = Number(form.hours) * 60 + Number(form.mins)
    if (!form.date) return setFormError('Choose the date you worked.')
    if (minutes < 15) return setFormError('Log at least 15 minutes.')
    if (!form.description.trim()) return setFormError('Describe the work you did.')

    setSaving(true)
    setFormError('')
    try {
      const data = { date: form.date, minutes, description: form.description.trim() }
      const saved = await guard(() => (editingId ? updateMyWorkLog(token, editingId, data) : createMyWorkLog(token, data)))
      if (saved.date.startsWith(month)) {
        setLogs((prev) => {
          const rest = prev.filter((l) => l.id !== saved.id)
          return [saved, ...rest].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
        })
      } else {
        setLogs((prev) => prev.filter((l) => l.id !== saved.id))
        setMonth(saved.date.slice(0, 7))
      }
      resetForm()
    } catch (err) {
      setFormError(err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (log) => {
    if (!window.confirm(`Delete ${formatMinutes(log.minutes)} on ${formatExpenseDate(log.date)}?`)) return
    try {
      await guard(() => deleteMyWorkLog(token, log.id))
      setLogs((prev) => prev.filter((l) => l.id !== log.id))
      if (editingId === log.id) resetForm()
    } catch (err) {
      setError(err.message || 'Failed to delete.')
    }
  }

  const rate = profile?.hourlyRate

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">My Hours</h1>
          <p className="text-sm text-brand-muted mt-0.5">
            Log the hours you work. The Trust reviews each entry before it is paid
            {rate ? <> at <strong className="text-brand-text">{formatINR(rate)}/hour</strong></> : null}.
          </p>
        </div>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${staffInputClasses} !w-auto`} aria-label="Month">
          {recentMonths().map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Clock} label="Hours logged" value={formatMinutes(sumMinutes(counted))} accent="bg-blue-50 text-brand-navy" />
        <StatCard icon={CheckCircle2} label="Approved" value={formatMinutes(sumMinutes(approved))} accent="bg-green-50 text-green-700" />
        <StatCard icon={Hourglass} label="Awaiting approval" value={formatMinutes(sumMinutes(pending))} sub={pending.length ? `${pending.length} ${pending.length === 1 ? 'entry' : 'entries'}` : ''} accent="bg-amber-50 text-amber-700" />
        <StatCard icon={IndianRupee} label="Approved earnings" value={formatINR(approvedAmount)} accent="bg-red-50 text-brand-red" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-xl p-5 mb-6" noValidate>
        <h2 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4 flex items-center gap-2">
          {editingId ? <><Pencil className="w-4 h-4" /> Edit entry</> : <><Plus className="w-4 h-4" /> Log hours</>}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-[10rem_auto_1fr] gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-brand-text mb-1.5">Date</span>
            <input type="date" value={form.date} max={todayISO()} onChange={set('date')} className={staffInputClasses} />
          </label>
          <div>
            <span className="block text-xs font-semibold text-brand-text mb-1.5">Time worked</span>
            <div className="flex items-center gap-2">
              <select value={form.hours} onChange={set('hours')} className={`${staffInputClasses} !w-20`} aria-label="Hours">
                {HOUR_OPTIONS.map((h) => <option key={h} value={h}>{h} h</option>)}
              </select>
              <select value={form.mins} onChange={set('mins')} className={`${staffInputClasses} !w-24`} aria-label="Minutes">
                {MINUTE_OPTIONS.map((m) => <option key={m} value={m}>{m} min</option>)}
              </select>
            </div>
          </div>
          <label className="block">
            <span className="block text-xs font-semibold text-brand-text mb-1.5">What did you work on?</span>
            <input type="text" value={form.description} onChange={set('description')} maxLength={500} placeholder="e.g. Maths class for Batch A, 10:00–12:00" className={staffInputClasses} />
          </label>
        </div>
        {formError && <p className="text-sm text-brand-red mt-3">{formError}</p>}
        <div className="flex items-center justify-end gap-3 mt-4">
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-semibold text-brand-muted hover:bg-brand-surface">Cancel</button>
          )}
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 disabled:opacity-50">
            {saving ? 'Saving…' : editingId ? 'Update Entry' : 'Submit Hours'}
          </button>
        </div>
      </form>

      {error && <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>}

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-text">Entries · {monthLabel(month)}</h2>
          <span className="text-xs text-brand-muted">{logs.length} {logs.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">No hours logged for {monthLabel(month)} yet.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {logs.map((log) => {
              const status = WORK_LOG_STATUS[log.status]
              const estimate = rate ? Math.round((rate * log.minutes) / 60) : null
              return (
                <li key={log.id} className="px-5 py-3.5 flex items-start gap-4">
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-semibold text-brand-text">{shortDate(log.date)}</p>
                    <p className="text-xs text-brand-muted">{formatMinutes(log.minutes)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-text">{log.description}</p>
                    {log.status === 'rejected' && log.rejectionReason && (
                      <p className="text-xs text-brand-red mt-0.5">Reason: {log.rejectionReason}</p>
                    )}
                    {log.payoutId && <p className="text-xs text-green-700 mt-0.5">Paid</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${status.className}`}>{status.label}</span>
                    <p className="text-xs text-brand-muted mt-1 tabular-nums">
                      {log.status === 'approved' ? formatINR(log.amount) : log.status === 'pending' && estimate !== null ? `≈ ${formatINR(estimate)}` : ''}
                    </p>
                  </div>
                  {log.status !== 'approved' && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button type="button" onClick={() => startEdit(log)} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-navy" aria-label="Edit entry" title={log.status === 'rejected' ? 'Edit and resubmit' : 'Edit'}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(log)} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-red" aria-label="Delete entry" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-brand-border">
          <h2 className="text-sm font-bold text-brand-text flex items-center gap-2"><Wallet className="w-4 h-4" /> Payments received</h2>
        </div>
        {payouts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-brand-muted">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {payouts.map((p) => (
              <li key={p.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-semibold text-brand-text">{monthLabel(p.month)} · {formatMinutes(p.minutes)}</p>
                  <p className="text-xs text-brand-muted">
                    Paid {formatExpenseDate(p.paidOn)} by {getPaymentModeLabel(p.paymentMode)}{p.referenceNo ? ` · ${p.referenceNo}` : ''}
                  </p>
                </div>
                <p className="font-bold text-brand-text tabular-nums">{formatINR(p.amount)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
