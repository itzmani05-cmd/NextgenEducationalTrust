import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleIcon from '../components/GoogleIcon.jsx'
import logo from '../assests/Logo.png'

export default function Login() {
  const { user, loading, configured, signInWithGoogle, signInWithPassword } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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
    setSubmitting(true)
    try {
      await signInWithPassword(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="" className="w-14 h-14 object-contain mb-3" />
          <h1 className="text-xl font-bold text-brand-navy">Welcome Back</h1>
          <p className="text-sm text-brand-muted mt-1">Sign in to continue to your account.</p>
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

              {error && (
                <div className="bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !email || !password}
                className="w-full bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-brand-muted text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand-navy font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
