import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyApplication } from '../utils/api.js'
import { CONCESSION_LABELS } from '../utils/scholarshipCalc.js'
import SignInGate from '../components/apply/SignInGate.jsx'
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard.jsx'
import EmptyApplicationState from '../components/profile/EmptyApplicationState.jsx'
import ApplicationReferenceCard from '../components/profile/ApplicationReferenceCard.jsx'
import ApprovalCard from '../components/profile/ApprovalCard.jsx'
import ProgressTracker from '../components/profile/ProgressTracker.jsx'
import PaymentStatusLink from '../components/profile/PaymentStatusLink.jsx'

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
      <SEO title="My Profile | NextGen Solutions Educational Trust" description="Your NextGen Solutions Educational Trust account and scholarship application overview." path="/profile" noindex />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <ProfileHeaderCard user={user} onSignOut={signOut} />

        {loading ? (
          <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 mb-6">
            <p className="text-sm text-brand-muted">Loading…</p>
          </div>
        ) : !application ? (
          <EmptyApplicationState />
        ) : (
          <>
            <ApplicationReferenceCard application={application} />

            {showApprovalScreen && <ApprovalCard application={application} />}

            {!showApprovalScreen && (
              <div className="mb-6">
                <ProgressTracker application={application} />
              </div>
            )}

            <PaymentStatusLink payment={application.payment} />

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
