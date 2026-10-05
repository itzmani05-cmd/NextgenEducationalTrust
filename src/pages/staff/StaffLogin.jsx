import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, IdCard } from 'lucide-react'
import { useStaffAuth } from '../../context/StaffAuthContext.jsx'
import { StaffAuthCard, staffInputClasses } from '../../components/staff/StaffAuthCard.jsx'

export default function StaffLogin() {
  const { token, mustChangePassword, login } = useStaffAuth()
  const [staffCode, setStaffCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (token) return <Navigate to={mustChangePassword ? '/staff/change-password' : '/staff'} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(staffCode.trim(), password)
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StaffAuthCard title="Staff Sign In" subtitle="Use the Staff ID and password given to you by the Trust.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">Staff ID</span>
          <div className="relative">
            <IdCard className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              autoComplete="username"
              value={staffCode}
              onChange={(e) => setStaffCode(e.target.value.toUpperCase())}
              placeholder="STF-0001"
              className={`${staffInputClasses} pl-10 uppercase`}
            />
          </div>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">Password</span>
          <div className="relative">
            <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${staffInputClasses} pl-10`}
            />
          </div>
        </label>

        {error && <div className="bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">{error}</div>}

        <button
          type="submit"
          disabled={submitting || !staffCode.trim() || !password}
          className="w-full bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="text-xs text-brand-muted text-center">Forgot your password? Ask the Trust admin to reset it.</p>
      </form>
    </StaffAuthCard>
  )
}
