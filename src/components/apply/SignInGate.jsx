import { useState } from 'react'
import { LogIn, FileText, UploadCloud, BadgeCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import GoogleIcon from '../GoogleIcon.jsx'

const documents = [
  { title: 'Student Photograph' },
  { title: 'Identity Document' },
  { title: '10th Mark Sheet' },
  { title: '12th Mark Sheet' },
  { title: 'Latest College Mark Sheet' },
  { title: 'Government-issued Income Certificate' },
  { title: "Father's / Mother's Death Certificate", conditional: true },
  { title: 'Single-Parent Supporting Proof', conditional: true },
  { title: 'Diploma Mark Sheet', conditional: true },
  { title: 'Tamil-Medium Evidence', conditional: true },
  { title: 'SC/ST Community Certificate', conditional: true },
  { title: 'Financial Self-Support Evidence', conditional: true },
  { title: 'Existing Scholarship Proof', conditional: true },
]

const steps = [
  { icon: LogIn, title: 'Sign in with Google', desc: 'So you can save progress and check your status anytime.' },
  { icon: FileText, title: 'Fill your application', desc: 'Student, family, financial and education details across a few short steps.' },
  { icon: UploadCloud, title: 'Upload documents', desc: 'Photo, ID, and academic certificates as required for your case.' },
  { icon: BadgeCheck, title: 'Track & get approved', desc: 'The Trust reviews your application and confirms your fee concession.' },
]

export default function SignInGate() {
  const { signInWithGoogle, configured } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-brand-surface min-h-screen py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-5 text-brand-muted bg-white">
            Why Apply
          </span>
          <h1 className="font-serif text-2xl md:text-3xl text-brand-ink mb-3 leading-tight">
            A Scholarship Built for Deserving Students
          </h1>
          <p className="text-brand-muted leading-relaxed mb-8">
            NextGen Solutions Educational Trust offers fee concessions and support to students who
            need it most, alongside the C³ Educational Platform&apos;s technical skill development
            program for competitive government and GATE examinations.
          </p>

          <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide mb-3">Documents You&apos;ll Need</h2>
          <div className="space-y-2 mb-2">
            {documents.map(({ title, conditional }) => (
              <div key={title} className="flex items-center justify-between gap-3 bg-white border border-brand-border rounded-lg px-4 py-3">
                <span className="text-sm font-medium text-brand-text">{title}</span>
                {conditional && (
                  <span className="text-xs text-brand-muted shrink-0">(if applicable)</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-brand-muted mb-8">
            The Trust may request an additional supporting certificate if any submitted document needs further verification.
          </p>

          <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide mb-3">Application Steps</h2>
          <div className="space-y-3">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-text">{title}</p>
                  <p className="text-xs text-brand-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 w-full max-w-sm mx-auto bg-white border border-brand-border rounded-xl p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-brand-navy mb-2">Sign In to Apply</h1>
          <p className="text-sm text-brand-muted mb-6">
            Please sign in with Google before starting your scholarship application. This lets you
            save your progress and check your status later.
          </p>

          {!configured ? (
            <p className="text-sm text-brand-red bg-red-50 border border-brand-red/30 rounded-lg p-3">
              Sign-in isn&apos;t configured yet. Please check back shortly.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-text font-semibold text-sm py-3 rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              {loading ? 'Redirecting…' : 'Continue with Google'}
            </button>
          )}

          {error && <p className="text-sm text-brand-red mt-4">{error}</p>}
        </div>
      </div>
    </div>
  )
}
