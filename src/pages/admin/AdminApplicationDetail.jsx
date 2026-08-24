import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import {
  getApplication, updateApplicationStatus, deleteApplication, updateConcession,
  getPaymentProofSignedUrl, approvePayment, rejectPayment,
  downloadApplicationPdf, AuthError,
  getFeeReceiptSignedUrlAdmin, generateFeeReceipt,
} from '../../utils/adminApi.js'
import { getAllRequiredDocuments } from '../../utils/documentChecklist.js'
import { getProvisional } from '../../utils/scholarshipCalc.js'
import { enOnly } from '../../i18n/bilingual.js'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ApplicantHeader from '../../components/admin/application-detail/ApplicantHeader.jsx'
import ActionsBar from '../../components/admin/application-detail/ActionsBar.jsx'
import ConcessionPanel from '../../components/admin/application-detail/ConcessionPanel.jsx'
import PaymentVerificationSection from '../../components/admin/application-detail/PaymentVerificationSection.jsx'
import FeeReceiptSection from '../../components/admin/application-detail/FeeReceiptSection.jsx'
import DownloadApplicationSection from '../../components/admin/application-detail/DownloadApplicationSection.jsx'
import StudentInfoSections from '../../components/admin/application-detail/StudentInfoSections.jsx'
import DocumentsSection from '../../components/admin/application-detail/DocumentsSection.jsx'
import DeclarationSection from '../../components/admin/application-detail/DeclarationSection.jsx'

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
  const [receiptBusy, setReceiptBusy] = useState(false)
  const [receiptError, setReceiptError] = useState('')
  const [downloadBusy, setDownloadBusy] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const [confirmState, setConfirmState] = useState(null)

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

  const doApprovePayment = async () => {
    setConfirmState(null)
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

  const handleApprovePayment = () => {
    setConfirmState({ message: 'Approve this payment?', onConfirm: doApprovePayment })
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

  const handleViewReceipt = async () => {
    setReceiptBusy(true)
    setReceiptError('')
    try {
      const { url } = await getFeeReceiptSignedUrlAdmin(token, id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setReceiptError(err.message || 'Failed to open fee receipt.')
    } finally {
      setReceiptBusy(false)
    }
  }

  const handleGenerateReceipt = async () => {
    setReceiptBusy(true)
    setReceiptError('')
    try {
      const payment = await generateFeeReceipt(token, id)
      setApp((prev) => ({ ...prev, payment }))
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setReceiptError(err.message || 'Failed to generate fee receipt.')
    } finally {
      setReceiptBusy(false)
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

  const doDelete = async () => {
    setConfirmState(null)
    try {
      await deleteApplication(token, id)
      navigate('/admin')
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || 'Failed to delete application.')
    }
  }

  const handleDelete = () => {
    setConfirmState({
      title: 'Delete application?',
      message: 'Permanently delete this application? This cannot be undone.',
      tone: 'danger',
      confirmLabel: 'Delete',
      onConfirm: doDelete,
    })
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
  // moved further along into the payment stages — used to keep the Accept
  // button and the concession panel correct at every later status.
  const acceptedOrBeyond = !['submitted', 'under_review', 'rejected'].includes(app.status)
  const paymentApproved = app.payment?.status === 'approved'

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <ApplicantHeader app={app} />

      <ActionsBar
        appId={app.id}
        verificationComplete={verificationComplete}
        reviewedCount={reviewedCount}
        docsCount={docs.length}
        updating={updating}
        acceptedOrBeyond={acceptedOrBeyond}
        onAccept={() => handleStatusChange('approved')}
        onDelete={handleDelete}
      />

      {acceptedOrBeyond && (
        <ConcessionPanel
          app={app}
          suggestion={suggestion}
          concessionCategory={concessionCategory}
          onCategorySelect={handleCategorySelect}
          finalAmount={finalAmount}
          onFinalAmountChange={setFinalAmount}
          concessionNote={concessionNote}
          onConcessionNoteChange={setConcessionNote}
          courseFee={courseFee}
          onCourseFeeChange={setCourseFee}
          concessionError={concessionError}
          savingConcession={savingConcession}
          onSave={handleSaveConcession}
        />
      )}

      {app.payment && (
        <PaymentVerificationSection
          app={app}
          proofLoading={proofLoading}
          onViewProof={handleViewProof}
          paymentError={paymentError}
          paymentBusy={paymentBusy}
          showRejectPaymentForm={showRejectPaymentForm}
          onShowRejectForm={() => setShowRejectPaymentForm(true)}
          onCancelReject={() => { setShowRejectPaymentForm(false); setRejectReason('') }}
          rejectReason={rejectReason}
          onRejectReasonChange={setRejectReason}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
        />
      )}

      {app.payment?.status === 'approved' && (
        <FeeReceiptSection
          app={app}
          receiptError={receiptError}
          receiptBusy={receiptBusy}
          onViewReceipt={handleViewReceipt}
          onGenerateReceipt={handleGenerateReceipt}
        />
      )}

      {paymentApproved && (
        <DownloadApplicationSection
          downloadError={downloadError}
          downloadBusy={downloadBusy}
          onDownload={handleDownloadApplication}
        />
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>
      )}

      <div className="space-y-5">
        <StudentInfoSections app={app} />
        <DocumentsSection app={app} token={token} logout={logout} />
        <DeclarationSection app={app} />
      </div>

      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        tone={confirmState?.tone}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  )
}
