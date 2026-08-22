import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginBrandHeader from '../components/login/LoginBrandHeader.jsx'
import AuthNotConfiguredNotice from '../components/login/AuthNotConfiguredNotice.jsx'
import GoogleAuthButton from '../components/login/GoogleAuthButton.jsx'
import AuthDivider from '../components/login/AuthDivider.jsx'
import LoginForm from '../components/login/LoginForm.jsx'
import SignUpPrompt from '../components/login/SignUpPrompt.jsx'

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
        <LoginBrandHeader />

        {!configured ? (
          <AuthNotConfiguredNotice />
        ) : (
          <>
            <GoogleAuthButton onClick={handleGoogle} loading={googleLoading} />
            <AuthDivider />
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          </>
        )}

        <SignUpPrompt />
      </div>
    </div>
  )
}
