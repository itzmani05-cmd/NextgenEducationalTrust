import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, CreditCard, Upload, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyApplication, submitPayment } from '../utils/api.js'
import SignInGate from '../components/apply/SignInGate.jsx'
import OptionPills from '../components/apply/fields/OptionPills.jsx'
import TextField from '../components/apply/fields/TextField.jsx'

// Trust payment details — configurable via env instead of hardcoded here,
// since there's no admin-editable settings store yet (AdminSettings.jsx is
// still a stub). Set these in the frontend .env before going live.
const UPI_ID = import.meta.env.VITE_PAYMENT_UPI_ID || ''
const BANK_NAME = import.meta.env.VITE_PAYMENT_BANK_NAME || ''
const BANK_ACCOUNT_NAME = import.meta.env.VITE_PAYMENT_BANK_ACCOUNT_NAME || ''
const BANK_ACCOUNT_NUMBER = import.meta.env.VITE_PAYMENT_BANK_ACCOUNT_NUMBER || ''
const BANK_IFSC = import.meta.env.VITE_PAYMENT_BANK_IFSC || ''

const MAX_FILE_SIZE = 1024 * 1024 // 1MB — must match the server's multer limit (server/src/routes/applications.js)

const METHOD_OPTIONS = [
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
]

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

function PaymentInstructions({ method }) {
  if (method === 'upi') {
    return (
      <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-text">
        {UPI_ID ? (
          <p>Pay to UPI ID: <span className="font-semibold">{UPI_ID}</span></p>
        ) : (
          <p className="text-brand-muted">UPI details aren&apos;t configured yet — contact the Trust office.</p>
        )}
      </div>
    )
  }
  if (method === 'bank_transfer') {
    return (
      <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-text space-y-1">
        {BANK_NAME ? (
          <>
            <p>Bank: <span className="font-semibold">{BANK_NAME}</span></p>
            <p>Account Name: <span className="font-semibold">{BANK_ACCOUNT_NAME}</span></p>
            <p>Account Number: <span className="font-semibold">{BANK_ACCOUNT_NUMBER}</span></p>
            <p>IFSC: <span className="font-semibold">{BANK_IFSC}</span></p>
          </>
        ) : (
          <p className="text-brand-muted">Bank details aren&apos;t configured yet — contact the Trust office.</p>
        )}
      </div>
    )
  }
  return (
    <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-muted">
      Contact the Trust office (nextgencollegesolutions@gmail.com / +91 93423 79043) to arrange payment.
    </div>
  )
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
      <Wrap>
        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 text-center">
          <p className="text-sm text-brand-red mb-4">{loadError || 'No application found.'}</p>
          <Link to="/profile" className="text-sm font-semibold text-brand-navy hover:underline">Back to Profile</Link>
        </div>
      </Wrap>
    )
  }

  if (application.finalApprovedConcession == null || application.courseFee == null) {
    return (
      <Wrap>
        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-bold text-brand-navy mb-2">Payment Not Available Yet</h1>
          <p className="text-sm text-brand-muted mb-4">
            Your scholarship concession hasn&apos;t been approved yet, so payment isn&apos;t open. Check your
            application status for updates.
          </p>
          <Link to="/profile" className="text-sm font-semibold text-brand-navy hover:underline">Back to Profile</Link>
        </div>
      </Wrap>
    )
  }

  const amountDue = Math.round(application.courseFee * (100 - application.finalApprovedConcession) / 100)
  const payment = application.payment

  if (payment && payment.status === 'submitted') {
    return (
      <Wrap>
        <StatusBanner
          tone="amber"
          icon={Clock}
          title="Payment Under Verification"
          desc="We've received your payment details and they're being reviewed by the Trust."
        />
        <SummaryCard application={application} amountDue={amountDue} payment={payment} />
      </Wrap>
    )
  }

  if (payment && payment.status === 'approved') {
    return (
      <Wrap>
        <StatusBanner
          tone="green"
          icon={CheckCircle2}
          title="Payment Verified Successfully"
          desc="Your certificate is now available."
        />
        <SummaryCard application={application} amountDue={amountDue} payment={payment} />
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-redDark transition-colors mt-6"
        >
          View Certificate
        </Link>
      </Wrap>
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
    <Wrap>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-white shadow-sm text-brand-navy flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Payment</h1>
          <p className="text-sm text-brand-muted">
            Complete your scholarship fee payment and submit the transaction details below.
          </p>
        </div>
      </div>

      {isResubmit && (
        <div className="bg-red-50 border border-brand-red/30 rounded-xl p-4 my-6">
          <p className="text-sm font-semibold text-brand-red flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4" /> Payment Rejected
          </p>
          <p className="text-sm text-brand-text">{payment.rejectionReason || 'The submitted transaction could not be verified.'}</p>
        </div>
      )}

      <div className="mt-6">
        <SummaryCard application={application} amountDue={amountDue} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 mt-6 space-y-5">
        <OptionPills label="Payment Method" required value={method} onChange={setMethod} options={METHOD_OPTIONS} />
        <PaymentInstructions method={method} />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            label="Payment Transaction ID"
            required
            value={transactionId}
            onChange={setTransactionId}
            placeholder="e.g. UPI Ref / UTR number"
          />
          <TextField label="Payment Date" type="date" required value={paymentDate} onChange={setPaymentDate} />
        </div>

        <TextField
          label="Amount Paid (₹)"
          type="number"
          required
          value={amountPaid}
          onChange={setAmountPaid}
          placeholder={String(amountDue)}
        />

        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">
            Payment Screenshot / Proof <span className="text-brand-red">*</span>
          </span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-border rounded-xl py-6 text-sm font-medium text-brand-navy hover:border-brand-navy hover:bg-brand-surface transition-colors"
          >
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> {proof ? proof.name : 'Upload screenshot or PDF'}
            </span>
            {!proof && <span className="text-xs font-normal text-brand-muted">Up to 1MB</span>}
          </button>
          {proofSizeError && <p className="text-sm text-brand-red mt-1.5">{proofSizeError}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => handleProofChange(e.target.files?.[0] || null)}
          />
        </label>

        {submitError && <p className="text-sm text-brand-red">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-red text-white font-semibold text-sm py-3 rounded-lg shadow-sm hover:bg-brand-redDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : isResubmit ? 'Resubmit Payment Details' : 'Submit Payment Details'}
        </button>
      </form>
    </Wrap>
  )
}

function StatusBanner({ tone, icon: Icon, title, desc }) {
  const styles = tone === 'green'
    ? { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', iconText: 'text-green-700' }
    : { bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', iconText: 'text-brand-amber' }

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-2xl p-6 flex items-center gap-4 mb-6`}>
      <div className={`w-11 h-11 rounded-full ${styles.iconBg} ${styles.iconText} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-brand-text">{title}</h1>
        <p className="text-sm text-brand-muted">{desc}</p>
      </div>
    </div>
  )
}

function SummaryCard({ application, amountDue, payment }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="divide-y divide-brand-border">
        <Row label="Application No" value={`NGC-${application.id.slice(0, 8).toUpperCase()}`} />
        <Row label="Course" value={application.college?.degree || application.examName || '—'} />
        <Row label="Original Course Fee" value={`₹${application.courseFee.toLocaleString('en-IN')}`} />
        <Row label="Approved Concession" value={`${application.finalApprovedConcession}%`} />
        <Row
          label="Discount Amount"
          value={`₹${(application.courseFee - amountDue).toLocaleString('en-IN')}`}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 bg-brand-surface rounded-xl px-5 py-4">
        <span className="text-brand-text font-semibold">Amount Payable</span>
        <span className="text-2xl font-extrabold text-brand-navy">₹{amountDue.toLocaleString('en-IN')}</span>
      </div>

      {payment && (
        <div className="pt-4 mt-4 border-t border-brand-border divide-y divide-brand-border">
          <Row label="Transaction ID" value={payment.transactionId} />
          <Row label="Amount Paid" value={`₹${payment.amountPaid?.toLocaleString('en-IN')}`} />
        </div>
      )}
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

function Wrap({ children }) {
  return (
    <div className="bg-brand-surface min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-12 sm:py-16">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        {children}
      </div>
    </div>
  )
}
