import { useEffect, useState } from 'react'
import { Clock, CheckCircle2, Hourglass, Wallet, Receipt } from 'lucide-react'
import WorkLogReviewActions from './WorkLogReviewActions.jsx'
import { PAYMENT_MODES, formatExpenseDate, formatINR, getPaymentModeLabel } from '../expenses/expenseConstants.js'
import { WORK_LOG_STATUS, currentMonth, formatMinutes, monthLabel, recentMonths, shortDate, todayISO } from '../../staff/staffConstants.js'

const inputClasses =
  'rounded-lg border border-brand-border bg-white px-3 py-2 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy'

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}><Icon className="w-4.5 h-4.5" /></div>
      <div className="min-w-0">
        <p className="text-base font-bold text-brand-text tabular-nums truncate">{value}</p>
        <p className="text-xs text-brand-muted">{label}</p>
      </div>
    </div>
  )
}

function PayPanel({ staff, month, minutes, amount, onPay }) {
  const [form, setForm] = useState({ paidOn: todayISO(), paymentMode: 'bank_transfer', referenceNo: '', recordExpense: true })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onPay({ month, ...form, referenceNo: form.referenceNo.trim() })
    } catch (err) {
      setError(err.message || 'Failed to record payment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-green-200 rounded-xl p-5 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-brand-text flex items-center gap-2"><Wallet className="w-4 h-4 text-green-700" /> Ready to pay · {monthLabel(month)}</h3>
          <p className="text-xs text-brand-muted mt-0.5">
            {formatMinutes(minutes)} approved and unpaid.
            {staff.bankAccountNumber ? ` Pay to A/c ${staff.bankAccountNumber} · ${staff.bankIfsc || ''}` : ' Bank details not provided yet.'}
          </p>
        </div>
        <p className="text-2xl font-bold text-green-700 tabular-nums">{formatINR(amount)}</p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-xs font-semibold text-brand-text mb-1">Paid on</span>
          <input type="date" value={form.paidOn} max={todayISO()} onChange={(e) => setForm((f) => ({ ...f, paidOn: e.target.value }))} className={inputClasses} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-brand-text mb-1">Mode</span>
          <select value={form.paymentMode} onChange={(e) => setForm((f) => ({ ...f, paymentMode: e.target.value }))} className={inputClasses}>
            {PAYMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="block flex-1 min-w-[10rem]">
          <span className="block text-xs font-semibold text-brand-text mb-1">Reference / UTR</span>
          <input type="text" value={form.referenceNo} maxLength={100} onChange={(e) => setForm((f) => ({ ...f, referenceNo: e.target.value }))} placeholder="Optional" className={`${inputClasses} w-full`} />
        </label>
        <button type="submit" disabled={busy} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
          {busy ? 'Saving…' : 'Mark as Paid'}
        </button>
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-xs text-brand-muted cursor-pointer">
        <input type="checkbox" checked={form.recordExpense} onChange={(e) => setForm((f) => ({ ...f, recordExpense: e.target.checked }))} className="accent-brand-navy" />
        Also add this payment to Expenses (Salaries & Honorarium)
      </label>
      {error && <p className="text-sm text-brand-red mt-2">{error}</p>}
    </form>
  )
}

export default function StaffHoursPanel({ staff, loadLogs, loadPayouts, onReview, onPay }) {
  const [month, setMonth] = useState(currentMonth)
  const [logs, setLogs] = useState([])
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    loadLogs(month)
      .then((rows) => !cancelled && setLogs(rows))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load hours.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [month, loadLogs])

  useEffect(() => {
    loadPayouts().then(setPayouts).catch(() => {})
  }, [loadPayouts])

  const sum = (rows, key = 'minutes') => rows.reduce((s, l) => s + (l[key] || 0), 0)
  const approved = logs.filter((l) => l.status === 'approved')
  const pending = logs.filter((l) => l.status === 'pending')
  const unpaid = approved.filter((l) => !l.payoutId)

  const review = async (log, data) => {
    const updated = await onReview(log, data)
    setLogs((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
  }

  const pay = async (data) => {
    const payout = await onPay(data)
    setPayouts((prev) => [payout, ...prev])
    setLogs((prev) => prev.map((l) => (l.status === 'approved' && !l.payoutId ? { ...l, payoutId: payout.id } : l)))
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-bold text-brand-text uppercase tracking-wide">Logged hours</h2>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={inputClasses} aria-label="Month">
          {recentMonths().map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat icon={Clock} label="Logged" value={formatMinutes(sum(logs.filter((l) => l.status !== 'rejected')))} accent="bg-blue-50 text-brand-navy" />
        <Stat icon={Hourglass} label="Awaiting approval" value={formatMinutes(sum(pending))} accent="bg-amber-50 text-amber-700" />
        <Stat icon={CheckCircle2} label="Approved" value={formatMinutes(sum(approved))} accent="bg-green-50 text-green-700" />
        <Stat icon={Wallet} label="Approved amount" value={formatINR(sum(approved, 'amount'))} accent="bg-red-50 text-brand-red" />
      </div>

      {error && <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>}

      {unpaid.length > 0 && (
        <PayPanel staff={staff} month={month} minutes={sum(unpaid)} amount={sum(unpaid, 'amount')} onPay={pay} />
      )}

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden mb-8">
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-muted">No hours logged in {monthLabel(month)}.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {logs.map((log) => {
              const status = WORK_LOG_STATUS[log.status]
              return (
                <li key={log.id} className="px-5 py-3.5 flex flex-wrap items-start gap-x-4 gap-y-2">
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-semibold text-brand-text">{shortDate(log.date)}</p>
                    <p className="text-xs text-brand-muted">{formatMinutes(log.minutes)}</p>
                  </div>
                  <div className="flex-1 min-w-[12rem]">
                    <p className="text-sm text-brand-text">{log.description}</p>
                    {log.status === 'rejected' && log.rejectionReason && <p className="text-xs text-brand-red mt-0.5">Rejected: {log.rejectionReason}</p>}
                    {log.status === 'approved' && (
                      <p className="text-xs text-brand-muted mt-0.5">
                        {formatINR(log.amount)} at {formatINR(log.hourlyRate)}/hr{log.payoutId && <span className="text-green-700 font-semibold"> · Paid</span>}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.className}`}>{status.label}</span>
                  {!log.payoutId && <WorkLogReviewActions log={log} onReview={review} />}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <h2 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-3">Payment history</h2>
      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        {payouts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-brand-muted">No payments recorded yet.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {payouts.map((p) => (
              <li key={p.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-semibold text-brand-text">{monthLabel(p.month)} · {formatMinutes(p.minutes)}</p>
                  <p className="text-xs text-brand-muted">
                    Paid {formatExpenseDate(p.paidOn)} by {getPaymentModeLabel(p.paymentMode)}{p.referenceNo ? ` · ${p.referenceNo}` : ''}
                    {p.expenseId && <span className="inline-flex items-center gap-1 ml-2 text-brand-navy"><Receipt className="w-3 h-3" /> In Expenses</span>}
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
