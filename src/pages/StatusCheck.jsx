import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, CheckCircle2, Clock, XCircle, AlertCircle, Upload, Award, LogIn, FileSearch, Percent, Wallet,
} from 'lucide-react'
import { lookupApplication, uploadDocument } from '../utils/api.js'
import { getAllRequiredDocuments } from '../utils/documentChecklist.js'
import { CONCESSION_LABELS } from '../utils/scholarshipCalc.js'
import StatusBadge from '../components/admin/StatusBadge.jsx'
import { bi } from '../i18n/bilingual.js'

const PAYMENT_STATUS_TEXT = {
  submitted: 'Payment Submitted — Under Verification',
  approved: 'Payment Verified',
  rejected: 'Payment Rejected',
}

function docState(app, key) {
  const review = app.documentReviews?.[key]
  if (review?.status === 'approved') return 'approved'
  if (review?.status === 'rejected') return 'rejected'
  if (app.documentPresence?.[key]) return 'pending'
  return 'missing'
}

function DocIcon({ state }) {
  if (state === 'approved') return <CheckCircle2 className="w-5 h-5 text-green-600" />
  if (state === 'rejected') return <XCircle className="w-5 h-5 text-brand-red" />
  if (state === 'pending') return <Clock className="w-5 h-5 text-brand-amber" />
  return <AlertCircle className="w-5 h-5 text-brand-muted" />
}

function DocRow({ app, doc, onReupload }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState('')
  const state = docState(app, doc.key)
  const review = app.documentReviews?.[doc.key]
  const needsAction = state === 'rejected' || state === 'missing'

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setLocalError('')
    try {
      await uploadDocument(app.id, doc.key, file)
      await onReupload()
    } catch (err) {
      setLocalError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border border-brand-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <DocIcon state={state} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-text">{bi(doc.labelKey)}</p>
            <p className="text-xs text-brand-muted mt-0.5">
              {state === 'approved' && 'Verified and accepted.'}
              {state === 'pending' && 'Uploaded — awaiting review.'}
              {state === 'missing' && 'Not uploaded yet.'}
              {state === 'rejected' && 'Rejected — please re-upload.'}
            </p>
            {state === 'rejected' && review?.comment && (
              <p className="text-xs text-brand-red mt-1">&ldquo;{review.comment}&rdquo;</p>
            )}
            {localError && <p className="text-xs text-brand-red mt-1">{localError}</p>}
          </div>
        </div>

        {needsAction && (
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy border border-brand-navy px-3 py-1.5 rounded-lg hover:bg-brand-surface transition-colors disabled:opacity-40"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : state === 'rejected' ? 'Re-upload' : 'Upload'}
            </button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function StatusCheck() {
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runLookup = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await lookupApplication(mobile, email)
      setApp(result)
    } catch (err) {
      setError(err.message || 'Failed to look up application.')
      setApp(null)
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => lookupApplication(mobile, email).then(setApp)

  const docs = app ? getAllRequiredDocuments(app) : []
  const reviewedCount = docs.filter((d) => docState(app || {}, d.key) === 'approved' || docState(app || {}, d.key) === 'rejected').length

  return (
    <div className="bg-brand-surface min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-white shadow-sm text-brand-navy flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
            Check Application Status
          </h1>
          <p className="text-brand-muted text-sm">
            Enter the mobile number and email you applied with.
          </p>
        </div>

        <form onSubmit={runLookup} className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="block text-sm font-medium text-brand-text mb-1.5">Mobile Number</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-brand-text mb-1.5">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
              />
            </label>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !mobile || !email}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching…' : 'Check Status'}
          </button>
        </form>

        {app && (
          <div className="space-y-6">
            <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold text-brand-text">{app.fullName}</p>
                <p className="text-xs text-brand-muted">NGC-{app.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            {app.concession && (
              <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase tracking-wide mb-0.5">Scholarship Concession</p>
                    <p className="font-semibold text-brand-text">
                      {CONCESSION_LABELS[app.concession.category] || app.concession.category}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-brand-navy">{app.concession.percentage}%</span>
              </div>
            )}

            {app.payment && (
              <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase tracking-wide mb-0.5">Payment</p>
                    <p className="font-semibold text-brand-text">
                      {PAYMENT_STATUS_TEXT[app.payment.status] || app.payment.status}
                    </p>
                  </div>
                </div>
                {app.payment.status === 'rejected' && app.payment.rejectionReason && (
                  <p className="text-sm text-brand-red mt-2 ml-[52px]">&ldquo;{app.payment.rejectionReason}&rdquo;</p>
                )}
                {app.payment.status === 'approved' && (
                  <p className="text-sm text-brand-muted mt-2 ml-[52px]">
                    Paid ₹{app.payment.amountPaid?.toLocaleString('en-IN')}
                    {app.payment.verifiedAt && ` · Verified ${new Date(app.payment.verifiedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                  </p>
                )}
                <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline mt-3 ml-[52px]">
                  <LogIn className="w-3.5 h-3.5" /> Sign in to manage payment
                </Link>
              </div>
            )}

            {app.certificate && (
              <div className="bg-gradient-to-br from-brand-navy to-[#102a5e] rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">Certificate Available</p>
                    <p className="font-semibold">{app.certificate.certificateNumber}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 bg-white text-brand-navy px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95 transition-all"
                >
                  Sign in to download
                </Link>
              </div>
            )}

            <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-brand-text">Documents</h2>
                {docs.length > 0 && (
                  <span className="text-xs font-medium text-brand-muted">
                    {reviewedCount} of {docs.length} reviewed
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {docs.map((doc) => (
                  <DocRow key={doc.key} app={app} doc={doc} onReupload={refresh} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
