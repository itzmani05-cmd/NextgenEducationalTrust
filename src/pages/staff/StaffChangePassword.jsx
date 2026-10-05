import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStaffAuth } from '../../context/StaffAuthContext.jsx'
import { AuthError, changeStaffPassword } from '../../utils/staffApi.js'
import { StaffAuthCard, staffInputClasses } from '../../components/staff/StaffAuthCard.jsx'

const MIN_LENGTH = 8

export default function StaffChangePassword() {
  const { token, mustChangePassword, setSession, logout } = useStaffAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!token) return <Navigate to="/staff/login" replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.next.length < MIN_LENGTH) return setError(`New password must be at least ${MIN_LENGTH} characters.`)
    if (form.next !== form.confirm) return setError('The new passwords do not match.')
    setSubmitting(true)
    setError('')
    try {
      const { token: newToken } = await changeStaffPassword(token, form.current, form.next)
      setSession(newToken, false)
      navigate('/staff', { replace: true })
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to change password.')
      setSubmitting(false)
    }
  }

  return (
    <StaffAuthCard
      title={mustChangePassword ? 'Set Your Password' : 'Change Password'}
      subtitle={mustChangePassword ? 'You signed in with a temporary password. Choose your own password to continue.' : 'Choose a new password for your staff account.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">{mustChangePassword ? 'Temporary password' : 'Current password'}</span>
          <input type="password" autoComplete="current-password" autoFocus value={form.current} onChange={set('current')} className={staffInputClasses} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">New password</span>
          <input type="password" autoComplete="new-password" value={form.next} onChange={set('next')} className={staffInputClasses} />
          <span className="block text-xs text-brand-muted mt-1">At least {MIN_LENGTH} characters.</span>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">Confirm new password</span>
          <input type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} className={staffInputClasses} />
        </label>

        {error && <div className="bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">{error}</div>}

        <button
          type="submit"
          disabled={submitting || !form.current || !form.next || !form.confirm}
          className="w-full bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : 'Save Password'}
        </button>
        <div className="flex justify-between text-xs">
          {!mustChangePassword ? (
            <button type="button" onClick={() => navigate('/staff')} className="font-semibold text-brand-navy hover:underline">← Back</button>
          ) : <span />}
          <button type="button" onClick={logout} className="font-semibold text-brand-muted hover:underline">Sign out</button>
        </div>
      </form>
    </StaffAuthCard>
  )
}
