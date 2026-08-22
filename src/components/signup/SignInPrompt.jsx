import { Link } from 'react-router-dom'

export default function SignInPrompt() {
  return (
    <p className="text-sm text-brand-muted text-center mt-6">
      Already have an account?{' '}
      <Link to="/login" className="text-brand-navy font-semibold hover:underline">
        Sign In
      </Link>
    </p>
  )
}
