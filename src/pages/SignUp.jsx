import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleIcon from '../components/GoogleIcon.jsx'
import logo from '../assests/Logo.png'

export default function SignUp() {
  const { user, loading, configured, signInWithGoogle, signUpWithPassword } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const data = await signUpWithPassword({ name, email, password })
      if (data?.session) {
        navigate('/')
      } else {
        setInfo('Account created! Please check your email to confirm your address, then sign in.')
      }
    } catch (err) {
      setError(err.message || 'Sign-up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="" className="w-14 h-14 object-contain mb-3" />
          <h1 className="text-xl font-bold text-brand-navy">Create Your Account</h1>
          <p className="text-sm text-brand-muted mt-1">Sign up to get started.</p>
        </div>

        {!configured ? (
          <p className="text-sm text-brand-red bg-red-50 border border-brand-red/30 rounded-lg p-3">
            Sign-in isn&apos;t configured yet. Please check back shortly.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full inline-flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-text font-semibold text-sm py-3 rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-brand-border" />
              <span className="text-xs font-medium text-brand-muted">OR</span>
              <div className="h-px flex-1 bg-brand-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-brand-text mb-1.5">Full Name</span>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-brand-text mb-1.5">Email</span>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-brand-text mb-1.5">Password</span>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-brand-text mb-1.5">
                  Confirm Password
                </span>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
                  />
                </div>
              </label>

              {error && (
                <div className="bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
                  {error}
                </div>
              )}

              {info && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-700">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !name || !email || !password || !confirmPassword}
                className="w-full bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating account…' : 'Sign Up'}
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-brand-muted text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-navy font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
