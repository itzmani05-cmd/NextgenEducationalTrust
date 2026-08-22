import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Mail, ArrowRight, CheckCircle2, Circle, Clock, XCircle, Award, Download, Eye,
  FileText, ShieldCheck, Percent, Wallet, LogOut, IndianRupee,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyApplication, getCertificateSignedUrl } from '../utils/api.js'
import { CONCESSION_LABELS } from '../utils/scholarshipCalc.js'
import SignInGate from '../components/apply/SignInGate.jsx'
import StatusBadge from '../components/admin/StatusBadge.jsx'

export default function Profile() {
  const { user, loading: authLoading, accessToken, signOut } = useAuth()

  if (authLoading) {
    return <div className="bg-brand-surface min-h-screen" />
  }
  if (!user) {
    return <SignInGate />
  }
  return <ProfileContent user={user} accessToken={accessToken} signOut={signOut} />
}

const STEP_ICONS = {
  done: CheckCircle2,
  active: Clock,
  rejected: XCircle,
  pending: Circle,
}

const STEP_STYLES = {
  done: { ring: 'bg-brand-navy text-white', line: 'bg-brand-navy', text: 'text-brand-text' },
  active: { ring: 'bg-white border-2 border-brand-amber text-brand-amber', line: 'bg-brand-border', text: 'text-brand-text' },
  rejected: { ring: 'bg-white border-2 border-brand-red text-brand-red', line: 'bg-brand-border', text: 'text-brand-text' },
  pending: { ring: 'bg-brand-surface text-brand-muted', line: 'bg-brand-border', text: 'text-brand-muted' },
}

function ProgressTracker({ application }) {
  const verificationDone = !['submitted', 'under_review'].includes(application.status)
  const concessionApproved = application.finalApprovedConcession != null
  const payment = application.payment
  const certificate = application.certificate

  let paymentState = 'pending'
  let paymentSubtitle = 'Not started'
  if (payment?.status === 'approved') {
    paymentState = 'done'
    paymentSubtitle = 'Payment Verified'
  } else if (payment?.status === 'rejected') {
    paymentState = 'rejected'
    paymentSubtitle = 'Rejected — resubmission needed'
  } else if (payment?.status === 'submitted') {
    paymentState = 'active'
    paymentSubtitle = 'Under Verification'
  } else if (concessionApproved) {
    paymentState = 'active'
    paymentSubtitle = 'Ready to pay'
  }

  const steps = [
    { state: 'done', icon: FileText, title: 'Application', subtitle: 'Submitted' },
    {
      state: verificationDone ? 'done' : 'active',
      icon: ShieldCheck,
      title: 'Verification',
      subtitle: verificationDone ? 'Verified' : 'In progress',
    },
    {
      state: concessionApproved ? 'done' : 'pending',
      icon: Percent,
      title: 'Concession',
      subtitle: concessionApproved ? `Approved — ${application.finalApprovedConcession}%` : 'Pending',
    },
    { state: paymentState, icon: Wallet, title: 'Payment', subtitle: paymentSubtitle },
    {
      state: certificate ? 'done' : 'pending',
      icon: Award,
      title: 'Certificate',
      subtitle: certificate ? 'Available' : 'Not available',
    },
  ]

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted mb-6">
        Application Progress
      </p>
      <div className="overflow-x-auto">
        <div className="flex items-start min-w-max sm:min-w-0">
          {steps.map((step, i) => {
            const Icon = step.icon
            const StepIcon = STEP_ICONS[step.state]
            const style = STEP_STYLES[step.state]
            return (
              <Fragment key={step.title}>
                <div className="flex flex-col items-center text-center w-28 shrink-0">
                  <div className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${style.ring}`}>
                    <Icon className="w-5 h-5" />
                    {step.state !== 'pending' && (
                      <StepIcon
                        className={`w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-white ${
                          step.state === 'done' ? 'text-brand-navy' : step.state === 'rejected' ? 'text-brand-red' : 'text-brand-amber'
                        }`}
                      />
                    )}
                  </div>
                  <p className={`text-xs font-semibold mt-2.5 ${style.text}`}>{step.title}</p>
                  <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{step.subtitle}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mt-[22px] rounded-full ${style.line}`} />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CertificateCard({ applicationId, accessToken, certificate }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const open = async (download) => {
    setLoading(true)
    setError('')
    try {
      const { url } = await getCertificateSignedUrl(applicationId, accessToken)
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      if (download) a.download = `${certificate.certificateNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      setError(err.message || 'Failed to open certificate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-brand-navy to-[#102a5e] rounded-2xl shadow-sm p-6 sm:p-8 text-white">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-white/60">Certificate Available</p>
          <p className="font-semibold truncate">{certificate.certificateNumber}</p>
          <p className="text-xs text-white/60">
            Issued {new Date(certificate.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-red-200 mb-3">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => open(false)}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <Eye className="w-4 h-4" /> View Certificate
        </button>
        <button
          type="button"
          onClick={() => open(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white text-brand-navy px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Download Certificate
        </button>
      </div>
    </div>
  )
}

function ApprovalScreen({ application }) {
  const amountDue = Math.round(application.courseFee * (100 - application.finalApprovedConcession) / 100)
  const discount = application.courseFee - amountDue

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="bg-green-50 border-b border-green-100 px-6 sm:px-8 py-6 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-brand-text">Your application has been approved</h2>
          <p className="text-sm text-brand-muted">Review the concession below and proceed to payment.</p>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6">
        <div className="divide-y divide-brand-border">
          <Row label="Application No" value={`NGC-${application.id.slice(0, 8).toUpperCase()}`} />
          <Row label="Course" value={application.college?.degree || application.examName || '—'} />
          <Row label="Original Course Fee" value={`₹${application.courseFee.toLocaleString('en-IN')}`} />
          <Row label="Approved Concession" value={`${application.finalApprovedConcession}%`} />
          <Row label="Discount Amount" value={`₹${discount.toLocaleString('en-IN')}`} />
          {application.concessionDecidedAt && (
            <Row
              label="Approval Date"
              value={new Date(application.concessionDecidedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mt-4 mb-6 bg-brand-surface rounded-xl px-5 py-4">
          <span className="text-brand-text font-semibold flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4" /> Amount Payable
          </span>
          <span className="text-2xl font-extrabold text-brand-navy">₹{amountDue.toLocaleString('en-IN')}</span>
        </div>

        <Link
          to="/payment"
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors"
        >
          Proceed to Payment <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-brand-muted">{label}</span>
      <span className="text-sm font-semibold text-brand-text text-right">{value}</span>
    </div>
  )
}

function ProfileContent({ user, accessToken, signOut }) {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getMyApplication(accessToken)
      .then((app) => !cancelled && setApplication(app))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [accessToken])

  // A payment awaiting review or already approved means the concession
  // approval screen has already been acted on — the tracker takes over from there.
  const showApprovalScreen =
    application?.finalApprovedConcession != null && application?.courseFee != null && !application?.payment

  return (
    <div className="bg-brand-surface min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
        <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-20 bg-gradient-to-r from-brand-navy to-[#1d4ba8]" />
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex items-end justify-between -mt-9 mb-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-surface ring-4 ring-white shadow-sm flex items-center justify-center text-brand-navy shrink-0">
                  <User className="w-8 h-8" />
                </div>
              )}
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-red bg-brand-surface hover:bg-red-50 px-3 py-2 rounded-lg transition-colors mb-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
            <h1 className="text-xl font-bold text-brand-text truncate">
              {user.user_metadata?.full_name || 'Student'}
            </h1>
            <p className="text-sm text-brand-muted flex items-center gap-1.5 truncate mt-0.5">
              <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 mb-6">
            <p className="text-sm text-brand-muted">Loading…</p>
          </div>
        ) : !application ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 mb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center mx-auto mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-sm text-brand-muted mb-5">You haven&apos;t submitted an application yet.</p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors"
            >
              Start Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-wide">Reference Number</p>
                <p className="font-bold text-brand-navy">NGC-{application.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <StatusBadge status={application.status} />
            </div>

            {showApprovalScreen && <ApprovalScreen application={application} />}

            {!showApprovalScreen && (
              <div className="mb-6">
                <ProgressTracker application={application} />
              </div>
            )}

            {application.payment?.status === 'rejected' && (
              <Link
                to="/payment"
                className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors mb-6"
              >
                Resubmit Payment Details <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {application.payment?.status === 'submitted' && (
              <Link
                to="/payment"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:underline mb-6"
              >
                View payment details <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {application.certificate && (
              <div className="mb-6">
                <CertificateCard
                  applicationId={application.id}
                  accessToken={accessToken}
                  certificate={application.certificate}
                />
              </div>
            )}

            {application.finalApprovedConcession != null && !showApprovalScreen && (
              <p className="text-sm text-brand-muted mb-6">
                Concession category: {CONCESSION_LABELS[application.concessionCategory] || application.concessionCategory}
              </p>
            )}

            <Link
              to="/status"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:underline"
            >
              View full status &amp; documents <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
