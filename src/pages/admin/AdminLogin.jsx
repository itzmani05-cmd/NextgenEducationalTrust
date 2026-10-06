import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { enOnly } from '../../i18n/bilingual.js'
import logo from '../../assests/Logo.webp'
import AdminLoginForm from '../../components/admin/login/AdminLoginForm.jsx'

const panelPoints = ['admin.login.panelPoint1', 'admin.login.panelPoint2', 'admin.login.panelPoint3']

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
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-brand-surface">
      <Helmet>
        <title>Admin Sign In | NextGen Solutions Educational Trust</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand-ink text-white p-12 xl:p-16">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-navy/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-brand-rust/20 blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brand-rust/60 to-transparent" />

        <Link to="/" className="relative flex items-center gap-2.5 font-bold text-lg">
          <img src={logo} alt="" className="w-9 h-9 object-contain" />
          NextGen Solutions Educational Trust
        </Link>

        <div className="relative max-w-md">
          <h2 className="font-serif text-4xl xl:text-5xl leading-tight">{enOnly('admin.login.panelTitle')}</h2>
          <p className="mt-4 text-white/60 leading-relaxed">{enOnly('admin.login.panelBody')}</p>
          <ul className="mt-8 space-y-3.5">
            {panelPoints.map((key) => (
              <li key={key} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                {enOnly(key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          &copy; {new Date().getFullYear()} NextGen Solutions Educational Trust
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center px-6 py-12">
        <AdminLoginForm
          password={password}
          setPassword={setPassword}
          error={error}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {enOnly('admin.login.backToSite')}
        </Link>
      </main>
    </div>
  )
}
