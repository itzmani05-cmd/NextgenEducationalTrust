import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { enOnly } from '../../i18n/bilingual.js'
import AdminLoginForm from '../../components/admin/login/AdminLoginForm.jsx'

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
      <AdminLoginForm
        password={password}
        setPassword={setPassword}
        error={error}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
