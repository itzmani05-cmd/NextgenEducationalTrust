import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lock, LogOut } from 'lucide-react'
import Stepper, { STEP_COUNT } from '../components/apply/Stepper.jsx'
import { setPath, stripFiles } from '../utils/objectPath.js'
import { createApplication, finalizeApplication, getMyApplication } from '../utils/api.js'
import { isStepValid } from '../utils/applyValidation.js'
import { getAllRequiredDocuments, getDocumentPresenceMap } from '../utils/documentChecklist.js'
import { enOnly } from '../i18n/bilingual.js'
import { useAuth } from '../context/AuthContext.jsx'
import SignInGate from '../components/apply/SignInGate.jsx'
import ConfirmDialog from '../components/admin/ConfirmDialog.jsx'

import Step1Student from '../components/apply/steps/Step1Student.jsx'
import Step2Family from '../components/apply/steps/Step2Family.jsx'
import Step4Education from '../components/apply/steps/Step4Education.jsx'
import StepSummary from '../components/apply/steps/StepSummary.jsx'
import Step11Declaration from '../components/apply/steps/Step11Declaration.jsx'
import Step9Documents from '../components/apply/steps/Step9Documents.jsx'

const TOTAL_STEPS = STEP_COUNT
const DRAFT_KEY = 'ngc_scholarship_application_draft'
// Declaration is the last step of "phase 1" (details). Locking here closes
// steps 1-5 (details, summary, declaration) for editing and hands the
// applicant off to the Documents step, which is the only thing left open.
const LOCK_STEP = 5

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
// very end of the wizard. An application still in `uploading` status isn't
// "already applied" yet, though — the details are locked in, but the
// applicant hasn't finished uploading documents and clicking Submit
// Application, so resume them straight into the Documents step instead of
// blocking them out.
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
    if (existing.status === 'uploading') {
      return <ApplyForm existingApplication={existing} />
    }
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

function ApplyForm({ existingApplication }) {
  const { user, accessToken } = useAuth()

  const [initialState] = useState(() => {
    if (existingApplication) {
      // Details/summary/declaration are already saved server-side — jump
      // straight to the Documents step rather than replaying the draft.
      return { step: TOTAL_STEPS, data: initialData }
    }
    const draft = loadDraft()
    return {
      step: draft?.step ?? 1,
      data: draft?.data ? { ...initialData, ...draft.data } : initialData,
    }
  })

  const [step, setStep] = useState(initialState.step)
  const [data, setData] = useState(initialState.data)
  const [applicationRecord, setApplicationRecord] = useState(existingApplication || null)
  const [documentPresence, setDocumentPresence] = useState(() => (
    existingApplication ? getDocumentPresenceMap(existingApplication) : {}
  ))
  const locked = Boolean(applicationRecord)
  const [confirmLockOpen, setConfirmLockOpen] = useState(false)
  const [locking, setLocking] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (submitted || locked) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data: stripFiles(data) }))
    } catch {
      // localStorage unavailable or quota exceeded — caching is a convenience, not critical
    }
  }, [step, data, submitted, locked])

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

  const requiredDocs = getAllRequiredDocuments(applicationRecord || data).filter((doc) => doc.required !== false)
  const docsComplete = locked && requiredDocs.every((doc) => documentPresence[doc.key])

  const goNext = () => {
    if (!isStepValid(step, data)) return
    if (step === LOCK_STEP) {
      setConfirmLockOpen(true)
      return
    }
    const next = Math.min(step + 1, TOTAL_STEPS)
    setStep(next)
    scrollTop()
  }
  const confirmLock = async () => {
    setConfirmLockOpen(false)
    setLocking(true)
    setFormError('')
    try {
      const created = await createApplication(data, accessToken)
      setApplicationRecord(created)
      setDocumentPresence(getDocumentPresenceMap(created))
      setStep(LOCK_STEP + 1)
      localStorage.removeItem(DRAFT_KEY)
      scrollTop()
    } catch (err) {
      setFormError(err.message || 'Failed to save your details. Please try again.')
    } finally {
      setLocking(false)
    }
  }
  const goBack = () => {
    if (locked) return
    setStep((s) => Math.max(1, s - 1))
    scrollTop()
  }
  const jumpTo = (n) => {
    if (locked && n <= LOCK_STEP) return
    setStep(n)
    scrollTop()
  }
  const handleDocUploaded = (docKey) => {
    setDocumentPresence((prev) => ({ ...prev, [docKey]: true }))
  }
  const handleFinish = async () => {
    if (!docsComplete || finishing) return
    setFinishing(true)
    setFormError('')
    try {
      const updated = await finalizeApplication(applicationRecord.id)
      setApplicationRecord(updated)
      setSubmitted(true)
      scrollTop()
    } catch (err) {
      setFormError(err.message || 'Failed to submit your application. Please try again.')
    } finally {
      setFinishing(false)
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
                <p className="text-brand-navy font-bold text-lg">
                  NGC-{applicationRecord.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

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
      case 4: return <StepSummary {...stepProps} />
      case 5: return <Step11Declaration {...stepProps} />
      case 6: return (
        <Step9Documents
          applicationId={applicationRecord?.id}
          docsSource={applicationRecord || data}
          documentPresence={documentPresence}
          onUploaded={handleDocUploaded}
        />
      )
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

        {formError && (
          <div className="mt-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">
            {formError}
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || locked}
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
            {step === TOTAL_STEPS && !docsComplete && (
              <span className="text-xs text-brand-muted hidden sm:inline">
                {enOnly('common.completeRequired')}
              </span>
            )}

            {step < TOTAL_STEPS && step !== LOCK_STEP && (
              <button
                type="button"
                onClick={goNext}
                disabled={!stepValid}
                className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                {enOnly('common.nextStep')} <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === LOCK_STEP && (
              <button
                type="button"
                onClick={goNext}
                disabled={!stepValid || locking}
                className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                <Lock className="w-4 h-4" /> {locking ? enOnly('common.locking') : enOnly('common.lockAndContinue')}
              </button>
            )}

            {step === TOTAL_STEPS && (
              <button
                type="button"
                onClick={handleFinish}
                disabled={!docsComplete || finishing}
                className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-redDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {finishing ? enOnly('common.submitting') : enOnly('common.submitApplication')}
                {!finishing && <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLockOpen}
        title={enOnly('common.confirmLockTitle')}
        message={enOnly('common.confirmLockMessage')}
        confirmLabel={enOnly('common.lockAndContinue')}
        onConfirm={confirmLock}
        onCancel={() => setConfirmLockOpen(false)}
      />
    </div>
  )
}
