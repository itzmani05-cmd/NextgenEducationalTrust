import { Mail, Lock } from 'lucide-react'
import AuthField from './AuthField.jsx'

export default function LoginForm({ email, setEmail, password, setPassword, error, submitting, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField
        icon={Mail}
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <AuthField
        icon={Lock}
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

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
  )
}
