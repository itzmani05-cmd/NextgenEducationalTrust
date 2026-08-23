import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyApplication, submitPayment, getFeeReceiptSignedUrl } from '../utils/api.js'
import SignInGate from '../components/apply/SignInGate.jsx'
import PaymentWrap from '../components/payment/PaymentWrap.jsx'
import PaymentHeader from '../components/payment/PaymentHeader.jsx'
import RejectionBanner from '../components/payment/RejectionBanner.jsx'
import SummaryCard from '../components/payment/SummaryCard.jsx'
import PaymentForm from '../components/payment/PaymentForm.jsx'
import StatusBanner from '../components/payment/StatusBanner.jsx'

const MAX_FILE_SIZE = 1024 * 1024 // 1MB — must match the server's multer limit (server/src/routes/applications.js)

export default function Payment() {
  const { user, loading: authLoading, accessToken } = useAuth()

  if (authLoading) {
    return <div className="bg-brand-surface min-h-screen" />
  }
  if (!user) {
    return <SignInGate />
  }
  return <PaymentContent accessToken={accessToken} />
}

function PaymentContent({ accessToken }) {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [method, setMethod] = useState('upi')
  const [transactionId, setTransactionId] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [proof, setProof] = useState(null)
  const [proofSizeError, setProofSizeError] = useState('')
  const fileRef = useRef(null)

  const handleProofChange = (selected) => {
    if (selected && selected.size > MAX_FILE_SIZE) {
      setProofSizeError('File is too large — the maximum size is 1MB.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    setProofSizeError('')
    setProof(selected)
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [receiptLoading, setReceiptLoading] = useState(false)
  const [receiptError, setReceiptError] = useState('')
  const handleDownloadReceipt = async (applicationId) => {
    setReceiptLoading(true)
    setReceiptError('')
    try {
      const { url } = await getFeeReceiptSignedUrl(applicationId, accessToken)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setReceiptError(err.message || 'Failed to open fee receipt.')
    } finally {
      setReceiptLoading(false)
    }
  }

  const load = () =>
    getMyApplication(accessToken)
      .then((app) => setApplication(app))
      .catch((err) => setLoadError(err.message || 'Failed to load your application.'))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  if (loading) {
    return <div className="bg-brand-surface min-h-screen" />
  }

  if (loadError || !application) {
    return (
      <PaymentWrap>
        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 text-center">
          <p className="text-sm text-brand-red mb-4">{loadError || 'No application found.'}</p>
          <Link to="/profile" className="text-sm font-semibold text-brand-navy hover:underline">Back to Profile</Link>
        </div>
      </PaymentWrap>
    )
  }

  if (application.finalApprovedConcession == null || application.courseFee == null) {
    return (
      <PaymentWrap>
        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-bold text-brand-navy mb-2">Payment Not Available Yet</h1>
          <p className="text-sm text-brand-muted mb-4">
            Your scholarship concession hasn&apos;t been approved yet, so payment isn&apos;t open. Check your
            application status for updates.
          </p>
          <Link to="/profile" className="text-sm font-semibold text-brand-navy hover:underline">Back to Profile</Link>
        </div>
      </PaymentWrap>
    )
  }

  const amountDue = Math.round(application.courseFee * (100 - application.finalApprovedConcession) / 100)
  const payment = application.payment

  if (payment && payment.status === 'submitted') {
    return (
      <PaymentWrap>
        <StatusBanner
          tone="amber"
          icon={Clock}
          title="Payment Under Verification"
          desc="We've received your payment details and they're being reviewed by the Trust."
        />
        <SummaryCard application={application} amountDue={amountDue} payment={payment} />
      </PaymentWrap>
    )
  }

  if (payment && payment.status === 'approved') {
    return (
      <PaymentWrap>
        <StatusBanner
          tone="green"
          icon={CheckCircle2}
          title="Payment Verified Successfully"
          desc="Your certificate is now available."
        />
        <SummaryCard application={application} amountDue={amountDue} payment={payment} />
        {receiptError && <p className="text-sm text-brand-red mt-4">{receiptError}</p>}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-redDark transition-colors"
          >
            View Certificate
          </Link>
          <button
            type="button"
            onClick={() => handleDownloadReceipt(application.id)}
            disabled={receiptLoading}
            className="inline-flex items-center gap-2 bg-white border border-brand-navy text-brand-navy px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-surface transition-colors disabled:opacity-40"
          >
            {receiptLoading ? 'Opening…' : 'Download Fee Receipt'}
          </button>
        </div>
      </PaymentWrap>
    )
  }

  const isResubmit = payment && payment.status === 'rejected'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!transactionId.trim()) return setSubmitError('Payment Transaction ID is required.')
    if (!paymentDate) return setSubmitError('Payment Date is required.')
    if (!amountPaid || Number(amountPaid) <= 0) return setSubmitError('Enter a valid Amount Paid.')
    if (!proof) return setSubmitError('Payment screenshot / proof is required.')

    setSubmitting(true)
    try {
      const updated = await submitPayment(application.id, accessToken, {
        transactionId: transactionId.trim(), paymentDate, paymentMethod: method, amountPaid, proof,
      })
      setApplication(updated)
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit payment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PaymentWrap>
      <PaymentHeader />

      {isResubmit && <RejectionBanner reason={payment.rejectionReason} />}

      <div className="mt-6">
        <SummaryCard application={application} amountDue={amountDue} />
      </div>

      <PaymentForm
        method={method}
        onMethodChange={setMethod}
        transactionId={transactionId}
        onTransactionIdChange={setTransactionId}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
        amountPaid={amountPaid}
        onAmountPaidChange={setAmountPaid}
        amountDue={amountDue}
        proof={proof}
        fileRef={fileRef}
        proofSizeError={proofSizeError}
        onProofChange={handleProofChange}
        submitError={submitError}
        submitting={submitting}
        isResubmit={isResubmit}
        onSubmit={handleSubmit}
      />
    </PaymentWrap>
  )
}
