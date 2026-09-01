import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/SEO.jsx'
import SignUpBrandHeader from '../components/signup/SignUpBrandHeader.jsx'
import AuthNotConfiguredNotice from '../components/signup/AuthNotConfiguredNotice.jsx'
import GoogleAuthButton from '../components/signup/GoogleAuthButton.jsx'
import AuthDivider from '../components/signup/AuthDivider.jsx'
import SignUpForm from '../components/signup/SignUpForm.jsx'
import SignInPrompt from '../components/signup/SignInPrompt.jsx'

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
      <SEO title="Create Account | NextGen Solutions Educational Trust" description="Create an account to apply for a NextGen Solutions Educational Trust scholarship." path="/signup" noindex />
      <div className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 shadow-sm">
        <SignUpBrandHeader />

        {!configured ? (
          <AuthNotConfiguredNotice />
        ) : (
          <>
            <GoogleAuthButton onClick={handleGoogle} loading={googleLoading} />
            <AuthDivider />
            <SignUpForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              error={error}
              info={info}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          </>
        )}

        <SignInPrompt />
      </div>
    </div>
  )
}
