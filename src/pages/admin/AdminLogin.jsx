import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { enOnly } from '../../i18n/bilingual.js'
import logo from '../../assests/Logo.png'

export default function AdminLogin() {
  const { token, login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (token) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(password)
    } catch (err) {
      setError(err.message || enOnly('admin.login.loginFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 shadow-sm"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="" className="w-14 h-14 object-contain mb-3" />
          <h1 className="text-xl font-bold text-brand-navy">{enOnly('admin.login.heading')}</h1>
          <p className="text-sm text-brand-muted mt-1">
            {enOnly('admin.login.subtitle')}
          </p>
        </div>

        <label className="block mb-5">
          <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.login.password')}</span>
          <div className="relative">
            <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
            />
          </div>
        </label>

        {error && (
          <div className="mb-5 bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? enOnly('admin.login.signingIn') : enOnly('admin.login.signIn')}
        </button>
      </form>
    </div>
  )
}
