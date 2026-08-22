import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Trash2, Check, ShieldCheck, ExternalLink, XCircle, Award, RefreshCw, Download,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import {
  getApplication, updateApplicationStatus, deleteApplication, updateConcession,
  getSignedDocumentUrl, approvePayment, rejectPayment, getPaymentProofSignedUrl,
  generateCertificate, getCertificateSignedUrlAdmin, downloadApplicationPdf, AuthError,
} from '../../utils/adminApi.js'
import { getAllRequiredDocuments } from '../../utils/documentChecklist.js'
import { getProvisional } from '../../utils/scholarshipCalc.js'
import { enOnly } from '../../i18n/bilingual.js'
import StatusBadge from '../../components/admin/StatusBadge.jsx'

const CONCESSION_OPTIONS = [
  { value: 'category1', labelKey: 'admin.detail.concession.category1', sub: () => enOnly('admin.detail.concession.discount100') },
  { value: 'category2', labelKey: 'admin.detail.concession.category2', sub: () => enOnly('admin.detail.concession.discount50') },
  {
    value: 'category3',
    labelKey: 'admin.detail.concession.category3',
    sub: (s) => `25% / 40% / 50% base + factors, capped at 50% — calculated ${s?.provisional ?? 0}%`,
  },
  { value: 'category4', labelKey: 'admin.detail.concession.category4', sub: () => enOnly('admin.detail.concession.noDiscount') },
  { value: 'exceptional', labelKey: 'admin.detail.concession.exceptional', sub: () => enOnly('admin.detail.concession.trustCommitteeReview') },
]

// Maps the system's fine-grained calculation category onto the 5 options the
// Trust actually chooses between.
const AUTO_CATEGORY_MAP = {
  orphan: 'category1',
  single_parent: 'category2',
  income_1: 'category3',
  income_2: 'category3',
  income_3: 'category3',
  income_4: 'category4',
  pending: 'category4',
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-border last:border-0 gap-4">
      <span className="text-sm text-brand-muted shrink-0">{label}</span>
      <span className="text-sm font-medium text-brand-text text-right">{value || enOnly('admin.common.dash')}</span>
    </div>
  )
}

function DocRow({ label, docKey, hasFile, appId, token, logout }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleView = async () => {
    setLoading(true)
    setError(false)
    try {
      const { url } = await getSignedDocumentUrl(token, appId, docKey)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-border last:border-0 gap-4">
      <span className="text-sm text-brand-muted">{label}</span>
      {hasFile ? (
        <button
          type="button"
          onClick={handleView}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {loading ? enOnly('admin.common.opening') : error ? enOnly('admin.common.retry') : enOnly('admin.common.view')}
        </button>
      ) : (
        <span className="text-xs text-brand-muted">{enOnly('admin.common.notUploaded')}</span>
      )}
    </div>
  )
}

export default function AdminApplicationDetail() {
  const { id } = useParams()
  const { token, logout } = useAdminAuth()
  const navigate = useNavigate()

  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  const [concessionCategory, setConcessionCategory] = useState('')
  const [finalAmount, setFinalAmount] = useState('')
  const [concessionNote, setConcessionNote] = useState('')
  const [courseFee, setCourseFee] = useState('')
  const [savingConcession, setSavingConcession] = useState(false)
  const [concessionError, setConcessionError] = useState('')

  const [paymentBusy, setPaymentBusy] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [showRejectPaymentForm, setShowRejectPaymentForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [proofLoading, setProofLoading] = useState(false)
  const [certBusy, setCertBusy] = useState(false)
  const [certError, setCertError] = useState('')
  const [downloadBusy, setDownloadBusy] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    let cancelled = false
    getApplication(token, id)
      .then((data) => !cancelled && setApp(data))
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setError(err.message || 'Failed to load application.')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token, id, logout])

  const handleStatusChange = async (status) => {
    setUpdating(true)
    try {
      const updated = await updateApplicationStatus(token, id, status)
      setApp(updated)
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  const suggestion = app ? getProvisional(app) : null
  const suggestedCategory = suggestion ? AUTO_CATEGORY_MAP[suggestion.category.key] : 'category4'

  const defaultAmountFor = (cat) => {
    if (cat === 'category1') return 100
    if (cat === 'category2') return 50
    if (cat === 'category3') return suggestion?.provisional ?? 0
    if (cat === 'category4') return 0
    return '' // exceptional — no auto-calculated figure
  }

  useEffect(() => {
    if (!app) return
    const initCategory = app.concessionCategory || suggestedCategory
    setConcessionCategory(initCategory)
    setFinalAmount(
      app.finalApprovedConcession != null
        ? String(app.finalApprovedConcession)
        : String(defaultAmountFor(initCategory)),
    )
    setConcessionNote(app.concessionNote || '')
    setCourseFee(app.courseFee != null ? String(app.courseFee) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.id])

  const handleCategorySelect = (cat) => {
    setConcessionCategory(cat)
    setFinalAmount(String(defaultAmountFor(cat)))
  }

  const handleSaveConcession = async () => {
    setConcessionError('')
    if (!concessionCategory) {
      setConcessionError('Select a discount category.')
      return
    }
    if (concessionCategory === 'exceptional' && !concessionNote.trim()) {
      setConcessionError('A note is required for Exceptional Hardship decisions.')
      return
    }
    const amount = Number(finalAmount)
    if (!Number.isFinite(amount) || amount < 0 || amount > 100) {
      setConcessionError('Enter a valid percentage between 0 and 100.')
      return
    }
    const fee = Number(courseFee)
    if (!Number.isFinite(fee) || fee <= 0) {
      setConcessionError('Enter the original course fee — the payable amount is calculated from it.')
      return
    }

    setSavingConcession(true)
    try {
      const updated = await updateConcession(token, id, {
        category: concessionCategory,
        finalApprovedConcession: Math.round(amount),
        note: concessionNote,
        courseFee: Math.round(fee),
      })
      setApp(updated)
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setConcessionError(err.message || 'Failed to save concession decision.')
    } finally {
      setSavingConcession(false)
    }
  }

  const handleViewProof = async () => {
    setProofLoading(true)
    setPaymentError('')
    try {
      const { url } = await getPaymentProofSignedUrl(token, id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setPaymentError(err.message || 'Failed to open payment proof.')
    } finally {
      setProofLoading(false)
    }
  }

  const handleApprovePayment = async () => {
    if (!window.confirm('Approve this payment? A certificate will be issued automatically once approved.')) return
    setPaymentBusy(true)
    setPaymentError('')
    try {
      const updated = await approvePayment(token, id)
      setApp((prev) => ({ ...prev, ...updated }))
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setPaymentError(err.message || 'Failed to approve payment.')
    } finally {
      setPaymentBusy(false)
    }
  }

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) {
      setPaymentError('A rejection reason is required.')
      return
    }
    setPaymentBusy(true)
    setPaymentError('')
    try {
      const updated = await rejectPayment(token, id, rejectReason.trim())
      setApp((prev) => ({ ...prev, ...updated }))
      setShowRejectPaymentForm(false)
      setRejectReason('')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setPaymentError(err.message || 'Failed to reject payment.')
    } finally {
      setPaymentBusy(false)
    }
  }

  const handleGenerateCertificate = async () => {
    setCertBusy(true)
    setCertError('')
    try {
      const certificate = await generateCertificate(token, id)
      setApp((prev) => ({ ...prev, certificate, status: 'certificate_issued' }))
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setCertError(err.message || 'Failed to generate certificate.')
    } finally {
      setCertBusy(false)
    }
  }

  const handleViewCertificate = async () => {
    setCertBusy(true)
    setCertError('')
    try {
      const { url } = await getCertificateSignedUrlAdmin(token, id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setCertError(err.message || 'Failed to open certificate.')
    } finally {
      setCertBusy(false)
    }
  }

  const handleDownloadApplication = async () => {
    setDownloadBusy(true)
    setDownloadError('')
    try {
      const { blob, filename } = await downloadApplicationPdf(token, id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setDownloadError(err.message || enOnly('admin.detail.downloadFailed'))
    } finally {
      setDownloadBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this application? This cannot be undone.')) return
    try {
      await deleteApplication(token, id)
      navigate('/admin')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to delete application.')
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-10 text-brand-muted">{enOnly('admin.common.loading')}</div>
  }

  if (error && !app) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>
      </div>
    )
  }

  if (!app) return null

  const docs = getAllRequiredDocuments(app)
  const reviewedCount = docs.filter((d) => {
    const s = app.documentReviews?.[d.key]?.status
    return s === 'approved' || s === 'rejected'
  }).length
  const verificationComplete = docs.length > 0 && reviewedCount === docs.length
  // True once the application has been accepted, whether or not it has since
  // moved further along into the payment/certificate stages — used to keep
  // the Accept button and the concession panel correct at every later status.
  const acceptedOrBeyond = !['submitted', 'under_review', 'rejected'].includes(app.status)
  const paymentApproved = app.payment?.status === 'approved'

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/admin/applications" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> {enOnly('admin.detail.backToApplications')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">{app.fullName}</h1>
          <p className="text-brand-muted text-sm">
            {enOnly('admin.detail.submittedOn')} {new Date(app.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={app.status} />
          <Link
            to={`/admin/verification/${app.id}`}
            className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> {enOnly('admin.detail.reviewDocuments')}
          </Link>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-brand-text mr-2">{enOnly('admin.detail.actions')}</span>
        {verificationComplete ? (
          <button
            type="button"
            disabled={updating || acceptedOrBeyond}
            onClick={() => handleStatusChange('approved')}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" /> {enOnly('admin.detail.accept')}
          </button>
        ) : (
          <Link
            to={`/admin/verification/${app.id}`}
            className="text-sm text-brand-muted hover:text-brand-navy hover:underline"
          >
            {enOnly('admin.detail.completeVerificationPrompt')} ({reviewedCount}/{docs.length}) {enOnly('admin.detail.toAcceptApplication')}
          </Link>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-2 bg-white border border-brand-red text-brand-red px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> {enOnly('admin.detail.remove')}
        </button>
      </div>

      {acceptedOrBeyond && (
        <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-1">
            {enOnly('admin.detail.discountConcession')}
          </h3>
          <p className="text-xs text-brand-muted mb-5">
            {enOnly('admin.detail.systemCalculated')} <span className="font-semibold text-brand-text">{app.calculatedConcession ?? 0}%</span>{' '}
            {enOnly('admin.detail.fromAnswers')}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {CONCESSION_OPTIONS.map((opt) => {
              const active = concessionCategory === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCategorySelect(opt.value)}
                  className={`text-left rounded-lg border p-4 transition-colors ${
                    active ? 'border-brand-navy ring-2 ring-brand-navy/20' : 'border-brand-border hover:border-brand-navy/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-semibold text-brand-text text-sm">{enOnly(opt.labelKey)}</span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        active ? 'border-brand-navy' : 'border-brand-border'
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-brand-navy" />}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted">{opt.sub(suggestion)}</p>
                </button>
              )
            })}
          </div>

          {concessionCategory === 'category3' && suggestion && (
            <div className="bg-brand-surface border border-brand-border rounded-lg p-4 mb-5 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-brand-muted">{enOnly('admin.detail.base')} ({suggestion.category.label})</span>
                <span className="font-medium text-brand-text">{suggestion.base}%</span>
              </div>
              {suggestion.additions.map((a) => (
                <div key={a.label} className="flex items-center justify-between py-1">
                  <span className="text-brand-text">{a.label}</span>
                  <span className="font-medium text-brand-navy">+{a.value}%</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-1 border-t border-brand-border mt-1 pt-2">
                <span className="text-brand-text font-medium">{enOnly('admin.detail.calculated')}</span>
                <span className="font-bold text-brand-text">
                  {suggestion.calculated}% ({enOnly('admin.detail.cappedAt')} {suggestion.cap}% → {suggestion.provisional}%)
                </span>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-4 max-w-xl">
            <label className="block">
              <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.detail.originalCourseFee')}</span>
              <input
                type="number"
                min="1"
                value={courseFee}
                onChange={(e) => setCourseFee(e.target.value)}
                placeholder="e.g. 20000"
                className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.detail.finalApprovedConcession')}</span>
              <input
                type="number"
                min="0"
                max="100"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
              />
            </label>
          </div>
          {courseFee && finalAmount && Number.isFinite(Number(courseFee)) && Number.isFinite(Number(finalAmount)) && (
            <p className="text-xs text-brand-muted mb-4">
              {enOnly('admin.detail.payableAmountWillBe')} ₹{Math.round(Number(courseFee) * (100 - Number(finalAmount)) / 100).toLocaleString('en-IN')}
            </p>
          )}

          <label className="block mb-4">
            <span className="block text-sm font-medium text-brand-text mb-1.5">
              {enOnly('admin.detail.trustCommitteeNotes')} {concessionCategory === 'exceptional' && <span className="text-brand-red">*</span>}
            </span>
            <textarea
              value={concessionNote}
              onChange={(e) => setConcessionNote(e.target.value)}
              rows={3}
              placeholder={enOnly('admin.detail.rationalePlaceholder')}
              className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
            />
          </label>

          {concessionError && <p className="text-sm text-brand-red mb-4">{concessionError}</p>}

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              type="button"
              onClick={handleSaveConcession}
              disabled={savingConcession}
              className="inline-flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savingConcession ? enOnly('admin.detail.saving') : enOnly('admin.detail.saveConcessionDecision')}
            </button>
            {app.concessionDecidedAt && (
              <p className="text-xs text-brand-muted">
                {enOnly('admin.detail.lastRecorded')} {new Date(app.concessionDecidedAt).toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>
      )}

      {app.payment && (
        <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4">{enOnly('admin.detail.paymentVerification')}</h3>

          <div className="grid sm:grid-cols-2 gap-x-8">
            <div>
              <Row label={enOnly('admin.detail.originalFee')} value={app.courseFee != null ? `₹${app.courseFee.toLocaleString('en-IN')}` : null} />
              <Row label={enOnly('admin.detail.approvedConcession')} value={app.finalApprovedConcession != null ? `${app.finalApprovedConcession}%` : null} />
              <Row label={enOnly('admin.detail.finalPayableAmount')} value={app.payment.amountDue != null ? `₹${app.payment.amountDue.toLocaleString('en-IN')}` : null} />
              <Row label={enOnly('admin.detail.amountPaid')} value={app.payment.amountPaid != null ? `₹${app.payment.amountPaid.toLocaleString('en-IN')}` : null} />
            </div>
            <div>
              <Row label={enOnly('admin.detail.transactionId')} value={app.payment.transactionId} />
              <Row label={enOnly('admin.detail.paymentMethod')} value={app.payment.paymentMethod} />
              <Row
                label={enOnly('admin.detail.paymentDate')}
                value={app.payment.paymentDate ? new Date(app.payment.paymentDate).toLocaleDateString('en-IN') : null}
              />
              <Row
                label={enOnly('admin.detail.submittedOn')}
                value={app.payment.submittedAt ? new Date(app.payment.submittedAt).toLocaleString('en-IN') : null}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-brand-border mt-2 gap-4">
            <span className="text-sm text-brand-muted shrink-0">{enOnly('admin.detail.paymentProof')}</span>
            <button
              type="button"
              onClick={handleViewProof}
              disabled={proofLoading}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
            >
              <ExternalLink className="w-3.5 h-3.5" /> {proofLoading ? enOnly('admin.common.opening') : enOnly('admin.common.view')}
            </button>
          </div>

          {app.payment.status === 'rejected' && app.payment.rejectionReason && (
            <p className="text-sm text-brand-red mt-3">
              {enOnly('admin.detail.previouslyRejected')} &ldquo;{app.payment.rejectionReason}&rdquo;
            </p>
          )}

          {paymentError && <p className="text-sm text-brand-red mt-3">{paymentError}</p>}

          {app.payment.status === 'submitted' && (
            <div className="mt-4">
              {!showRejectPaymentForm ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleApprovePayment}
                    disabled={paymentBusy}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
                  >
                    <Check className="w-4 h-4" /> {enOnly('admin.detail.approvePayment')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectPaymentForm(true)}
                    disabled={paymentBusy}
                    className="inline-flex items-center gap-2 border border-brand-red text-brand-red px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <XCircle className="w-4 h-4" /> {enOnly('admin.detail.rejectPayment')}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block mb-3">
                    <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.detail.rejectionReason')}</span>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={2}
                      placeholder={enOnly('admin.detail.rejectionReasonPlaceholder')}
                      className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
                    />
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleRejectPayment}
                      disabled={paymentBusy}
                      className="inline-flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors disabled:opacity-40"
                    >
                      {enOnly('admin.detail.confirmRejection')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowRejectPaymentForm(false); setRejectReason('') }}
                      className="text-sm font-semibold text-brand-muted hover:text-brand-text"
                    >
                      {enOnly('admin.common.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {app.payment?.status === 'approved' && (
        <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" /> {enOnly('admin.detail.certificate')}
          </h3>
          {certError && <p className="text-sm text-brand-red mb-3">{certError}</p>}
          {app.certificate ? (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold text-brand-text">{app.certificate.certificateNumber}</p>
                <p className="text-xs text-brand-muted">
                  {enOnly('admin.detail.issued')} {new Date(app.certificate.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <button
                type="button"
                onClick={handleViewCertificate}
                disabled={certBusy}
                className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
              >
                <ExternalLink className="w-4 h-4" /> {certBusy ? enOnly('admin.common.opening') : enOnly('admin.detail.viewCertificate')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-brand-muted">
                {enOnly('admin.detail.certApprovedNotGenerated')}
              </p>
              <button
                type="button"
                onClick={handleGenerateCertificate}
                disabled={certBusy}
                className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
              >
                <RefreshCw className="w-4 h-4" /> {certBusy ? enOnly('admin.detail.generating') : enOnly('admin.detail.generateCertificate')}
              </button>
            </div>
          )}
        </div>
      )}

      {paymentApproved && (
        <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-1 flex items-center gap-2">
            <Download className="w-4 h-4" /> {enOnly('admin.detail.downloadApplication')}
          </h3>
          <p className="text-xs text-brand-muted mb-4">{enOnly('admin.detail.downloadApplicationHelper')}</p>
          {downloadError && <p className="text-sm text-brand-red mb-3">{downloadError}</p>}
          <button
            type="button"
            onClick={handleDownloadApplication}
            disabled={downloadBusy}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
          >
            <Download className="w-4 h-4" /> {downloadBusy ? enOnly('admin.detail.preparingDownload') : enOnly('admin.detail.downloadApplication')}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>
      )}

      <div className="space-y-5">
        <Section title={enOnly('admin.detail.studentDetails')}>
          <Row label={enOnly('admin.detail.fields.fullName')} value={app.fullName} />
          <Row label={enOnly('admin.detail.fields.dob')} value={app.dob} />
          <Row label={enOnly('admin.detail.fields.gender')} value={app.gender} />
          <Row label={enOnly('admin.detail.fields.mobile')} value={app.mobile} />
          <Row label={enOnly('admin.detail.fields.email')} value={app.email} />
          <Row label={enOnly('admin.detail.fields.address')} value={app.address} />
          <Row label={enOnly('admin.detail.fields.district')} value={app.district} />
        </Section>

        <Section title={enOnly('admin.detail.family')}>
          <Row label={enOnly('admin.detail.fields.fatherName')} value={app.fatherName} />
          <Row label={enOnly('admin.detail.fields.fatherOccupation')} value={app.fatherOccupation} />
          <Row label={enOnly('admin.detail.fields.fatherContact')} value={app.fatherContact} />
          <Row label={enOnly('admin.detail.fields.motherName')} value={app.motherName} />
          <Row label={enOnly('admin.detail.fields.motherOccupation')} value={app.motherOccupation} />
          <Row label={enOnly('admin.detail.fields.motherContact')} value={app.motherContact} />
          <Row label={enOnly('admin.detail.fields.guardianName')} value={app.guardianName} />
          <Row label={enOnly('admin.detail.fields.guardianRelation')} value={app.guardianRelation} />
          <Row label={enOnly('admin.detail.fields.guardianContact')} value={app.guardianContact} />
          <Row label={enOnly('admin.detail.fields.parentStatus')} value={app.parentStatus} />
          <Row label={enOnly('admin.detail.fields.bothParentsDeceased')} value={app.bothParentsDeceased} />
          <Row label={enOnly('admin.detail.fields.singleParentSupported')} value={app.singleParent} />
          <Row label={enOnly('admin.detail.fields.supportingParent')} value={app.supportingParent} />
        </Section>

        <Section title={enOnly('admin.detail.financial')}>
          <Row label={enOnly('admin.detail.fields.annualIncome')} value={app.annualIncome} />
          <Row label={enOnly('admin.detail.fields.expenseBearer')} value={app.expenseBearer} />
          <Row label={enOnly('admin.detail.fields.selfEarning')} value={app.selfEarning} />
          <Row label={enOnly('admin.detail.fields.employmentType')} value={app.employmentType} />
          <Row label={enOnly('admin.detail.fields.monthlyIncome')} value={app.monthlyIncome} />
        </Section>

        <Section title={enOnly('admin.detail.socialCategoryScholarship')}>
          <Row label={enOnly('admin.detail.fields.socialCategory')} value={app.socialCategory} />
          <Row label={enOnly('admin.detail.fields.existingScholarship')} value={app.existingScholarship} />
          <Row label={enOnly('admin.detail.fields.scholarshipName')} value={app.scholarshipName} />
          <Row label={enOnly('admin.detail.fields.scholarshipProvider')} value={app.scholarshipProvider} />
          <Row label={enOnly('admin.detail.fields.scholarshipAmount')} value={app.scholarshipAmount} />
          <Row label={enOnly('admin.detail.fields.scholarshipYear')} value={app.scholarshipYear} />
        </Section>

        <Section title={enOnly('admin.detail.tenthStandard')}>
          <Row label={enOnly('admin.detail.fields.schoolName')} value={app.tenth?.schoolName} />
          <Row label={enOnly('admin.detail.fields.schoolType')} value={app.tenth?.schoolType} />
          <Row label={enOnly('admin.detail.fields.percentage')} value={app.tenth?.percentage} />
        </Section>

        <Section title={enOnly('admin.detail.twelfthStandard')}>
          <Row label={enOnly('admin.detail.fields.schoolName')} value={app.twelfth?.schoolName} />
          <Row label={enOnly('admin.detail.fields.schoolType')} value={app.twelfth?.schoolType} />
          <Row label={enOnly('admin.detail.fields.percentage')} value={app.twelfth?.percentage} />
        </Section>

        <Section title={enOnly('admin.detail.collegeInstitution')}>
          <Row label={enOnly('admin.detail.fields.name')} value={app.college?.name} />
          <Row label={enOnly('admin.detail.fields.type')} value={app.college?.type} />
          <Row label={enOnly('admin.detail.fields.address')} value={app.college?.address} />
          <Row label={enOnly('admin.detail.fields.rollNumber')} value={app.college?.rollNumber} />
          <Row label={enOnly('admin.detail.fields.degree')} value={app.college?.degree} />
          <Row label={enOnly('admin.detail.fields.branch')} value={app.college?.branch} />
          <Row label={enOnly('admin.detail.fields.year')} value={app.college?.year} />
          <Row label={enOnly('admin.detail.fields.semester')} value={app.college?.semester} />
          <Row label={enOnly('admin.detail.fields.academicYear')} value={app.college?.academicYear} />
          <Row label={enOnly('admin.detail.fields.expectedGraduation')} value={app.college?.gradYear} />
          <Row label={enOnly('admin.detail.fields.cgpaPercentage')} value={app.college?.cgpa} />
          <Row label={enOnly('admin.detail.fields.latestPercentage')} value={app.college?.latestPercentage} />
          <Row label={enOnly('admin.detail.fields.backlogs')} value={app.college?.backlogs} />
        </Section>

        <Section title={enOnly('admin.detail.academicMedium')}>
          <Row label={enOnly('admin.detail.fields.diploma')} value={app.hasDiploma} />
          <Row label={enOnly('admin.detail.fields.diplomaPercentage')} value={app.diplomaPercentage} />
          <Row label={enOnly('admin.detail.fields.latestAcademicPercentage')} value={app.latestAcademicPercentage} />
          <Row label={enOnly('admin.detail.fields.mediumOfInstruction')} value={app.medium} />
          <Row label={enOnly('admin.detail.fields.tamilMediumTill12')} value={app.tamilMediumTill12} />
        </Section>

        <Section title={enOnly('admin.detail.documents')}>
          {[
            { label: enOnly('admin.detail.docs.studentPhoto'), docKey: 'studentPhoto', hasFile: Boolean(app.studentPhotoUrl) },
            { label: enOnly('admin.detail.docs.identityDocument'), docKey: 'identityDocument', hasFile: Boolean(app.identityDocumentUrl) },
            { label: enOnly('admin.detail.docs.educationalCertificates'), docKey: 'educationalCertificates', hasFile: Boolean(app.educationalCertificatesUrl) },
            { label: enOnly('admin.detail.docs.tenthMarkSheet'), docKey: 'tenth.markSheet', hasFile: Boolean(app.tenth?.markSheet) },
            { label: enOnly('admin.detail.docs.twelfthMarkSheet'), docKey: 'twelfth.markSheet', hasFile: Boolean(app.twelfth?.markSheet) },
            { label: enOnly('admin.detail.docs.collegeMarkSheet'), docKey: 'college.markSheet', hasFile: Boolean(app.college?.markSheet) },
            { label: enOnly('admin.detail.docs.fatherDeathCert'), docKey: 'fatherDeathCert', hasFile: Boolean(app.fatherDeathCertUrl) },
            { label: enOnly('admin.detail.docs.motherDeathCert'), docKey: 'motherDeathCert', hasFile: Boolean(app.motherDeathCertUrl) },
            { label: enOnly('admin.detail.docs.singleParentProof'), docKey: 'supportingDocument', hasFile: Boolean(app.supportingDocumentUrl) },
            { label: enOnly('admin.detail.docs.incomeCertificate'), docKey: 'incomeCertificate', hasFile: Boolean(app.incomeCertificateUrl) },
            { label: enOnly('admin.detail.docs.diplomaMarkSheet'), docKey: 'diplomaMarkSheet', hasFile: Boolean(app.diplomaMarkSheetUrl) },
            { label: enOnly('admin.detail.docs.tamilEvidence'), docKey: 'tamilMediumEvidence', hasFile: Boolean(app.tamilMediumEvidenceUrl) },
            { label: enOnly('admin.detail.docs.govtSchoolEvidence'), docKey: 'govtSchoolEvidence', hasFile: Boolean(app.govtSchoolEvidenceUrl) },
            { label: enOnly('admin.detail.docs.communityCertificate'), docKey: 'communityCertificate', hasFile: Boolean(app.communityCertificateUrl) },
            { label: enOnly('admin.detail.docs.selfSupportEvidence'), docKey: 'selfIncomeDoc', hasFile: Boolean(app.selfIncomeDocUrl) },
            { label: enOnly('admin.detail.docs.scholarshipProof'), docKey: 'scholarshipDoc', hasFile: Boolean(app.scholarshipDocUrl) },
          ].map((doc) => (
            <DocRow key={doc.docKey} {...doc} appId={app.id} token={token} logout={logout} />
          ))}
        </Section>

        <Section title={enOnly('admin.detail.declaration')}>
          <Row label={enOnly('admin.detail.declarationAccepted')} value={app.declarationAccepted ? enOnly('common.yes') : enOnly('common.no')} />
        </Section>
      </div>
    </div>
  )
}
