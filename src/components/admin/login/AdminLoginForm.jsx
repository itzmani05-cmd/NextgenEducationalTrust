import { useState } from 'react'
import { Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'
import AdminLoginHeader from './AdminLoginHeader.jsx'

export default function AdminLoginForm({ password, setPassword, error, submitting, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  const trackCapsLock = (e) => setCapsLock(Boolean(e.getModifierState && e.getModifierState('CapsLock')))
  const toggleLabel = enOnly(showPassword ? 'admin.login.hidePassword' : 'admin.login.showPassword')

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white border border-brand-border rounded-2xl p-8 sm:p-9 shadow-xl shadow-brand-navy/5"
    >
      <AdminLoginHeader />

      <label className="block mb-5">
        <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.login.password')}</span>
        <div className="relative">
          <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={trackCapsLock}
            onKeyUp={trackCapsLock}
            onBlur={() => setCapsLock(false)}
            aria-invalid={Boolean(error)}
            className={`w-full rounded-lg border bg-white pl-10 pr-11 py-2.5 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-brand-red/50 focus:ring-brand-red/20 focus:border-brand-red'
                : 'border-brand-border focus:ring-brand-navy/30 focus:border-brand-navy'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={toggleLabel}
            title={toggleLabel}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-md text-brand-muted hover:text-brand-navy hover:bg-brand-surface transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {capsLock && (
          <span className="mt-1.5 flex items-center gap-1 text-xs text-brand-rust">
            <AlertCircle className="w-3.5 h-3.5" />
            {enOnly('admin.login.capsLockOn')}
          </span>
        )}
      </label>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !password}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg shadow-sm hover:brightness-110 active:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? enOnly('admin.login.signingIn') : enOnly('admin.login.signIn')}
      </button>

      <p className="mt-6 flex items-start justify-center gap-1.5 text-xs text-brand-muted text-center">
        <ShieldCheck className="w-3.5 h-3.5 mt-px shrink-0" />
        {enOnly('admin.login.restricted')}
      </p>
    </form>
  )
}
