import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LogOut } from 'lucide-react'
import Stepper, { STEP_COUNT } from '../components/apply/Stepper.jsx'
import { setPath, stripFiles } from '../utils/objectPath.js'
import { submitApplication, getMyApplication } from '../utils/api.js'
import { isStepValid } from '../utils/applyValidation.js'
import { enOnly } from '../i18n/bilingual.js'
import { useAuth } from '../context/AuthContext.jsx'
import SignInGate from '../components/apply/SignInGate.jsx'

import Step1Student from '../components/apply/steps/Step1Student.jsx'
import Step2Family from '../components/apply/steps/Step2Family.jsx'
import Step4Education from '../components/apply/steps/Step4Education.jsx'
import Step9Documents from '../components/apply/steps/Step9Documents.jsx'
import StepSummary from '../components/apply/steps/StepSummary.jsx'
import Step11Declaration from '../components/apply/steps/Step11Declaration.jsx'

const TOTAL_STEPS = STEP_COUNT
const DRAFT_KEY = 'ngc_scholarship_application_draft'

const initialData = {
  // Step 1
  examCategory: '', examName: '',
  fullName: '', dob: '', gender: '', mobile: '', email: '', district: '',
  address: { doorNo: '', street: '', place: '', pincode: '' },

  // Step 2
  fatherName: '', fatherOccupation: '', fatherContact: '',
  motherName: '', motherOccupation: '', motherContact: '',
  guardianName: '', guardianRelation: '', guardianContact: '',
  parentStatus: '',
  bothParentsDeceased: '', fatherDeathCert: null, motherDeathCert: null,
  singleParent: '', supportingParent: '', supportingDocument: null,

  // Step 3
  annualIncome: '', incomeCertificate: null,
  expenseBearer: '',
  selfEarning: '', employmentType: '', monthlyIncome: '', selfIncomeDoc: null,

  // Step 4
  tenth: { schoolName: '', schoolType: '', percentage: '', markSheet: null },
  twelfth: { schoolName: '', schoolType: '', percentage: '', markSheet: null },
  college: {
    name: '', type: '', address: '', rollNumber: '', degree: '', branch: '', year: '',
    semester: '', academicYear: '', gradYear: '', cgpa: '',
    currentlyStudying: '', markSheet: null,
  },
  existingScholarship: '', scholarshipName: '', scholarshipProvider: '',
  scholarshipAmount: '', scholarshipYear: '', scholarshipDoc: null,

  // Step 5
  hasDiploma: '', diplomaPercentage: '', diplomaMarkSheet: null,
  latestAcademicPercentage: '',

  // Step 6
  tamilMediumTill12: '', tamilMediumEvidence: null,

  // Step 7
  socialCategory: '', communityCertificate: null,

  // Step 9
  studentPhoto: null, identityDocument: null,

  // Step 11
  declarationAccepted: false,
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function Apply() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return <div className="bg-brand-surface min-h-screen" />
  }
  if (!user) {
    return <SignInGate />
  }
  return <ApplyGate />
}

// Each Google account gets a single application. Check up front so someone
// who's already applied sees that clearly instead of hitting a 409 at the
// very end of the wizard.
function ApplyGate() {
  const { accessToken, signOut } = useAuth()
  const [checking, setChecking] = useState(true)
  const [existing, setExisting] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMyApplication(accessToken)
      .then((application) => {
        if (!cancelled) setExisting(application)
      })
      .catch(() => {
        // Can't confirm either way — fail open and let the submit-time check
        // (which is the authoritative guard) catch a genuine duplicate.
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken])

  if (checking) {
    return <div className="bg-brand-surface min-h-screen" />
  }
  if (existing) {
    return <AlreadyApplied application={existing} signOut={signOut} />
  }
  return <ApplyForm />
}

function AlreadyApplied({ application, signOut }) {
  const badge = {
    submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved', rejected: 'Rejected',
  }[application.status] || application.status

  return (
    <div className="bg-brand-surface min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-brand-border rounded-xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-brand-navy mb-2">Application Already Submitted</h1>
        <p className="text-sm text-brand-muted mb-6">
          This Google account has already submitted a scholarship application. Only one
          application is allowed per account.
        </p>
        <div className="inline-block bg-brand-surface border border-brand-border rounded-lg px-6 py-3 mb-8">
          <p className="text-xs text-brand-muted uppercase tracking-wide">Reference Number</p>
          <p className="text-brand-navy font-bold text-lg">NGC-{application.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-brand-muted mt-1">Status: {badge}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/status"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors"
          >
            Check Application Status
          </a>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 bg-white border border-brand-navy text-brand-navy px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-surface transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function ApplyForm() {
  const { user, accessToken } = useAuth()

  const [initialState] = useState(() => {
    const draft = loadDraft()
    return {
      step: draft?.step ?? 1,
      data: draft?.data ? { ...initialData, ...draft.data } : initialData,
    }
  })

  const [step, setStep] = useState(initialState.step)
  const [data, setData] = useState(initialState.data)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [refNumber, setRefNumber] = useState('')
  const [failedUploads, setFailedUploads] = useState([])

  useEffect(() => {
    if (submitted) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data: stripFiles(data) }))
    } catch {
      // localStorage unavailable or quota exceeded — caching is a convenience, not critical
    }
  }, [step, data, submitted])

  // Email stays locked to the signed-in Google account (see Step1Student's
  // readOnly email field), so keep it synced to `user` rather than the editable
  // draft. Full name is only seeded from Google once, as a starting point —
  // it's editable, so a later `user` change must never overwrite what the
  // applicant has since typed.
  useEffect(() => {
    if (!user) return
    setData((prev) => ({
      ...prev,
      fullName: prev.fullName || user.user_metadata?.full_name || '',
      email: user.email || prev.email || '',
    }))
  }, [user])

  const setField = (path, value) => setData((prev) => setPath(prev, path, value))

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const stepValid = isStepValid(step, data)

  const goNext = () => {
    if (!isStepValid(step, data)) return
    const next = Math.min(step + 1, TOTAL_STEPS)
    setStep(next)
    scrollTop()
  }
  const goBack = () => {
    setStep((s) => Math.max(1, s - 1))
    scrollTop()
  }
  const jumpTo = (n) => {
    setStep(n)
    scrollTop()
  }
  const handleSubmit = async () => {
    if (!data.declarationAccepted || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const { application, failedUploads } = await submitApplication(data, accessToken)
      setRefNumber(`NGC-${application.id.slice(0, 8).toUpperCase()}`)
      setFailedUploads(failedUploads)
      setSubmitted(true)
      localStorage.removeItem(DRAFT_KEY)
      scrollTop()
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepProps = { data, setField, goToStep: jumpTo }

  if (submitted) {
    return (
      <div className="bg-brand-surface min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-6 py-16 w-full">
          <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden text-center">
            <div className="bg-green-50 border-b border-green-100 px-6 py-8">
              <div className="w-16 h-16 rounded-full bg-white text-green-700 shadow-sm flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                {enOnly('app.submittedTitle')}
              </h1>
              <p className="text-brand-muted">
                {enOnly('app.submittedThankYou').replaceAll('{name}', data.fullName ? `, ${data.fullName}` : '')}
              </p>
            </div>

            <div className="px-6 py-8">
              <div className="inline-block bg-brand-surface rounded-xl px-6 py-3 mb-6">
                <p className="text-xs text-brand-muted uppercase tracking-wide">{enOnly('app.referenceNumber')}</p>
                <p className="text-brand-navy font-bold text-lg">{refNumber}</p>
              </div>

              {failedUploads.length > 0 && (
                <div className="text-left bg-amber-50 border border-brand-amber/30 rounded-lg p-4 mb-6 text-sm text-brand-text">
                  <p className="font-semibold mb-1">
                    {failedUploads.length} document{failedUploads.length === 1 ? '' : 's'} didn&apos;t upload successfully.
                  </p>
                  <p className="text-brand-muted">
                    Your application was still submitted. Visit the status page (using your mobile
                    number and email) to retry uploading the affected document{failedUploads.length === 1 ? '' : 's'}.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-redDark transition-colors"
                >
                  {enOnly('app.returnHome')}
                </a>
                <a
                  href="/status"
                  className="inline-flex items-center gap-2 bg-white border border-brand-navy text-brand-navy px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-surface transition-colors"
                >
                  Check Application Status
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Student {...stepProps} />
      case 2: return <Step2Family {...stepProps} />
      case 3: return <Step4Education {...stepProps} />
      case 4: return <Step9Documents {...stepProps} />
      case 5: return <StepSummary {...stepProps} />
      case 6: return <Step11Declaration {...stepProps} />
      default: return null
    }
  }

  const stepTitles = enOnly('stepper.titles')
  const progressPct = Math.round((step / TOTAL_STEPS) * 100)

  return (
    <div className="bg-brand-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 md:p-8 mb-6">
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-1">
                {enOnly('app.title')}
              </h1>
              <p className="text-brand-muted text-sm">
                {`Step ${step} of ${TOTAL_STEPS} — ${stepTitles[step - 1]}`}
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-navy bg-brand-surface px-3 py-1.5 rounded-full shrink-0">
              {progressPct}% complete
            </span>
          </div>

          <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-brand-navy rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <Stepper current={step} />
        </div>

        <div className="question-counter space-y-6">{renderStep()}</div>

        {submitError && (
          <div className="mt-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">
            {submitError}
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-2 text-brand-navy font-semibold text-sm disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" /> {enOnly('common.back')}
          </button>

          <div className="flex items-center gap-3">
            {step < TOTAL_STEPS && !stepValid && (
              <span className="text-xs text-brand-muted hidden sm:inline">
                {enOnly('common.completeRequired')}
              </span>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!stepValid}
                className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                {enOnly('common.nextStep')} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!data.declarationAccepted || submitting}
                className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-redDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? enOnly('common.submitting') : enOnly('common.submitApplication')}
                {!submitting && <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
