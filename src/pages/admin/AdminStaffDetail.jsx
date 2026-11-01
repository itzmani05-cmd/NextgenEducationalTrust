import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, KeyRound, Clock, UserRound } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import {
  AuthError, createStaffPayout, getStaff, getStaffDocumentSignedUrl, listStaffPayouts, listStaffWorkLogs,
  resetStaffPassword, reviewWorkLog, updateStaff,
} from '../../utils/adminApi.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import StaffFormModal from '../../components/admin/staff/StaffFormModal.jsx'
import CredentialsDialog from '../../components/admin/staff/CredentialsDialog.jsx'
import StaffHoursPanel from '../../components/admin/staff/StaffHoursPanel.jsx'
import StaffProfilePanel from '../../components/admin/staff/StaffProfilePanel.jsx'
import { formatINR } from '../../components/admin/expenses/expenseConstants.js'

const TABS = [
  { key: 'hours', label: 'Hours & Payments', icon: Clock },
  { key: 'profile', label: 'Profile & Documents', icon: UserRound },
]

const stamp = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never')

export default function AdminStaffDetail() {
  const { id } = useParams()
  const { token, logout } = useAdminAuth()
  const [staff, setStaff] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('hours')
  const [editing, setEditing] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [credentials, setCredentials] = useState(null)

  const guard = useCallback(async (fn) => {
    try {
      return await fn()
    } catch (err) {
      if (err instanceof AuthError) logout()
      throw err
    }
  }, [logout])

  useEffect(() => {
    let cancelled = false
    guard(() => getStaff(token, id))
      .then((s) => !cancelled && setStaff(s))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load staff member.'))
    return () => {
      cancelled = true
    }
  }, [token, id, guard])

  const loadLogs = useCallback((month) => guard(() => listStaffWorkLogs(token, id, month)), [guard, token, id])
  const loadPayouts = useCallback(() => guard(() => listStaffPayouts(token, id)), [guard, token, id])
  const closeEdit = useCallback(() => setEditing(false), [])

  const handleSave = async (data) => {
    const updated = await guard(() => updateStaff(token, id, data))
    setStaff((prev) => ({ ...prev, ...updated }))
    setEditing(false)
  }

  const handleReset = async () => {
    setConfirmReset(false)
    try {
      const { staffCode, tempPassword } = await guard(() => resetStaffPassword(token, id))
      setStaff((prev) => ({ ...prev, mustChangePassword: true }))
      setCredentials({ title: 'Password reset', name: staff.name, staffCode, tempPassword })
    } catch (err) {
      setError(err.message || 'Failed to reset the password.')
    }
  }

  const viewDocument = async (docId) => {
    try {
      const { url } = await guard(() => getStaffDocumentSignedUrl(token, id, docId))
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err.message || 'Failed to open the document.')
    }
  }

  return (
    <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-6 py-10">
      <Link to="/admin/staff" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-navy mb-5">
        <ArrowLeft className="w-4 h-4" /> All staff
      </Link>

      <ErrorBanner message={error} />

      {!staff ? (
        !error && <p className="text-sm text-brand-muted">Loading…</p>
      ) : (
        <>
          <div className="bg-white border border-brand-border rounded-xl p-5 sm:p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-full bg-brand-navy text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {staff.name.trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-brand-navy truncate">{staff.name}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${staff.active ? 'bg-green-50 text-green-700' : 'bg-brand-surface text-brand-muted'}`}>
                      {staff.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-brand-muted mt-0.5">
                    <span className="font-mono font-semibold text-brand-text">{staff.staffCode}</span>
                    {staff.phone && <> · {staff.phone}</>}
                    {staff.email && <> · {staff.email}</>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 bg-white border border-brand-border text-brand-text px-3.5 py-2 rounded-lg text-sm font-semibold hover:border-brand-navy">
                  <KeyRound className="w-4 h-4" /> Reset Password
                </button>
                <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 bg-brand-navy text-white px-3.5 py-2 rounded-lg text-sm font-semibold hover:brightness-110">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>

            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-brand-border text-sm">
              <div>
                <dt className="text-xs text-brand-muted">Hourly rate</dt>
                <dd className="font-bold text-brand-text text-lg">{formatINR(staff.hourlyRate)}<span className="text-xs font-normal text-brand-muted"> / hour</span></dd>
              </div>
              <div>
                <dt className="text-xs text-brand-muted">Profile</dt>
                <dd className="font-bold text-brand-text text-lg">{staff.completeness.percent}%<span className="text-xs font-normal text-brand-muted"> complete</span></dd>
              </div>
              <div>
                <dt className="text-xs text-brand-muted">Last sign-in</dt>
                <dd className="font-medium text-brand-text">{stamp(staff.lastLoginAt)}</dd>
                {staff.mustChangePassword && <dd className="text-xs text-amber-700">Temporary password not yet changed</dd>}
              </div>
              <div>
                <dt className="text-xs text-brand-muted">Added</dt>
                <dd className="font-medium text-brand-text">{stamp(staff.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="flex gap-1 border-b border-brand-border mb-6" role="tablist">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  tab === key ? 'border-brand-navy text-brand-navy' : 'border-transparent text-brand-muted hover:text-brand-text'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
                {key === 'profile' && staff.completeness.percent < 100 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            ))}
          </div>

          {tab === 'hours' ? (
            <StaffHoursPanel
              staff={staff}
              loadLogs={loadLogs}
              loadPayouts={loadPayouts}
              onReview={(log, data) => guard(() => reviewWorkLog(token, log.id, data))}
              onPay={(data) => guard(() => createStaffPayout(token, id, data))}
            />
          ) : (
            <StaffProfilePanel staff={staff} onViewDocument={viewDocument} />
          )}

          <StaffFormModal open={editing} staff={staff} onClose={closeEdit} onSave={handleSave} />
          <ConfirmDialog
            open={confirmReset}
            title="Reset password?"
            message={`${staff.name} will be signed out everywhere and must sign in again with a new temporary password.`}
            confirmLabel="Reset Password"
            onConfirm={handleReset}
            onCancel={() => setConfirmReset(false)}
          />
          <CredentialsDialog credentials={credentials} onClose={() => setCredentials(null)} />
        </>
      )}
    </div>
  )
}
