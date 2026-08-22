import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import GoogleIcon from '../GoogleIcon.jsx'

export default function SignInGate() {
  const { signInWithGoogle, configured } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-brand-surface min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-brand-navy mb-2">Sign In to Apply</h1>
        <p className="text-sm text-brand-muted mb-6">
          Please sign in with Google before starting your scholarship application. This lets you
          save your progress and check your status later.
        </p>

        {!configured ? (
          <p className="text-sm text-brand-red bg-red-50 border border-brand-red/30 rounded-lg p-3">
            Sign-in isn&apos;t configured yet. Please check back shortly.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-text font-semibold text-sm py-3 rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>
        )}

        {error && <p className="text-sm text-brand-red mt-4">{error}</p>}
      </div>
    </div>
  )
}
