import GoogleIcon from '../GoogleIcon.jsx'

export default function GoogleAuthButton({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-text font-semibold text-sm py-3 rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-50"
    >
      <GoogleIcon />
      {loading ? 'Redirecting…' : 'Continue with Google'}
    </button>
  )
}
