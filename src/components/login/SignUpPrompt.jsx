import { Link } from 'react-router-dom'

export default function SignUpPrompt() {
  return (
    <p className="text-sm text-brand-muted text-center mt-6">
      Don&apos;t have an account?{' '}
      <Link to="/signup" className="text-brand-navy font-semibold hover:underline">
        Sign Up
      </Link>
    </p>
  )
}
