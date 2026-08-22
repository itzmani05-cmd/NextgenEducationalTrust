import { User, Mail, Lock } from 'lucide-react'
import AuthField from './AuthField.jsx'

export default function SignUpForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  info,
  submitting,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField
        icon={User}
        label="Full Name"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <AuthField
        icon={Lock}
        label="Confirm Password"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && (
        <div className="bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      {info && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-700">
          {info}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !name || !email || !password || !confirmPassword}
        className="w-full bg-brand-navy text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Creating account…' : 'Sign Up'}
      </button>
    </form>
  )
}
