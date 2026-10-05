import { useCallback, useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Clock, UserRound, LogOut, KeyRound, AlertCircle } from 'lucide-react'
import { useStaffAuth } from '../../context/StaffAuthContext.jsx'
import { AuthError, getMyProfile } from '../../utils/staffApi.js'
import logo from '../../assests/Logo.webp'

const NAV = [
  { to: '/staff', label: 'My Hours', icon: Clock, end: true },
  { to: '/staff/profile', label: 'My Profile', icon: UserRound },
]

export default function StaffLayout() {
  const { token, mustChangePassword, logout, setSession } = useStaffAuth()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  const guard = useCallback(async (fn) => {
    try {
      return await fn()
    } catch (err) {
      if (err instanceof AuthError) logout()
      else if (/temporary password/i.test(err.message || '')) setSession(token, true)
      throw err
    }
  }, [logout, setSession, token])

  useEffect(() => {
    if (!token || mustChangePassword) return
    let cancelled = false
    guard(() => getMyProfile(token))
      .then((p) => !cancelled && setProfile(p))
      .catch((err) => !cancelled && setError(err.message || 'Failed to load your profile.'))
    return () => {
      cancelled = true
    }
  }, [token, mustChangePassword, guard])

  if (!token) return <Navigate to="/staff/login" replace />
  if (mustChangePassword) return <Navigate to="/staff/change-password" replace />

  const linkClasses = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
      isActive ? 'bg-brand-navy text-white' : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
    }`

  const completeness = profile?.completeness?.percent ?? 100

  return (
    <div className="min-h-screen bg-brand-surface">
      <Helmet>
        <title>Staff Portal | NextGen Solutions Educational Trust</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="bg-white border-b border-brand-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="" className="w-8 h-8 object-contain shrink-0" />
            <div className="min-w-0 hidden sm:block">
              <p className="font-bold text-brand-navy leading-tight truncate">Staff Portal</p>
              <p className="text-xs text-brand-muted leading-tight truncate">
                {profile ? `${profile.name} · ${profile.staffCode}` : 'NextGen Solutions Educational Trust'}
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClasses}>
                <Icon className="w-4 h-4" /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1 shrink-0">
            <Link to="/staff/change-password" className="p-2 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-text" title="Change password" aria-label="Change password">
              <KeyRound className="w-4 h-4" />
            </Link>
            <button type="button" onClick={logout} className="p-2 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-red" title="Sign out" aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error && <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>}
        {profile && completeness < 100 && (
          <Link
            to="/staff/profile"
            className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">
              Your profile is <strong>{completeness}%</strong> complete. Please add your qualification, bank details and documents.
            </span>
            <span className="font-semibold whitespace-nowrap">Complete profile →</span>
          </Link>
        )}
        <Outlet context={{ token, profile, setProfile, guard }} />
      </main>
    </div>
  )
}
