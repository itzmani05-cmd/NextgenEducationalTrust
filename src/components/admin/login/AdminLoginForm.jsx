import { Lock } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'
import AdminLoginHeader from './AdminLoginHeader.jsx'

export default function AdminLoginForm({ password, setPassword, error, submitting, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 shadow-sm"
    >
      <AdminLoginHeader />

      <label className="block mb-5">
        <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.login.password')}</span>
        <div className="relative">
          <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
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
  )
}
