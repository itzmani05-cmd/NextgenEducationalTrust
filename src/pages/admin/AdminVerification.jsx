import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import {
  listApplications, updateApplicationStatus, updateDocumentReview, getSignedDocumentUrl, AuthError,
} from '../../utils/adminApi.js'
import { getDocumentsNeedingReview, getDocumentFieldPath } from '../../utils/documentChecklist.js'
import { getPath } from '../../utils/objectPath.js'
import { enOnly } from '../../i18n/bilingual.js'
import ErrorBanner from '../../components/admin/ErrorBanner.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ApplicantSummaryCard from '../../components/admin/verification/ApplicantSummaryCard.jsx'
import VerificationProgressCard from '../../components/admin/verification/VerificationProgressCard.jsx'
import DocumentTabs from '../../components/admin/verification/DocumentTabs.jsx'
import DocumentReviewPanel from '../../components/admin/verification/DocumentReviewPanel.jsx'

export default function AdminVerification() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, logout } = useAdminAuth()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDoc, setSelectedDoc] = useState('')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [signedUrl, setSignedUrl] = useState('')
  const [signedUrlLoading, setSignedUrlLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [confirmState, setConfirmState] = useState(null)

  useEffect(() => {
    let cancelled = false
    listApplications(token)
      .then((data) => !cancelled && setApplications(data))
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setError(err.message || enOnly('admin.verification.loadFailed'))
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token, logout])

  useEffect(() => {
    if (!id && applications.length > 0) {
      navigate(`/admin/verification/${applications[0].id}`, { replace: true })
    }
  }, [id, applications, navigate])

  useEffect(() => {
    setSelectedDoc('')
  }, [id])

  const index = applications.findIndex((a) => a.id === id)
  const app = index >= 0 ? applications[index] : null
  // Documents the applicant wasn't asked for, or was allowed to skip and
  // didn't upload, aren't shown as tabs — nothing there for the admin to
  // review.
  const docs = app ? getDocumentsNeedingReview(app) : []

  useEffect(() => {
    if (!selectedDoc && docs.length > 0) setSelectedDoc(docs[0].key)
  }, [docs, selectedDoc])

  useEffect(() => {
    setComment(app?.documentReviews?.[selectedDoc]?.comment || '')
  }, [app, selectedDoc])

  useEffect(() => {
    const hasPath = app && selectedDoc && getPath(app, getDocumentFieldPath(selectedDoc))
    if (!hasPath) {
      setSignedUrl('')
      return
    }
    let cancelled = false
    setSignedUrlLoading(true)
    getSignedDocumentUrl(token, app.id, selectedDoc)
      .then(({ url }) => !cancelled && setSignedUrl(url))
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setSignedUrl('')
      })
      .finally(() => !cancelled && setSignedUrlLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.id, selectedDoc, token])

  // Show the student's uploaded photo as the sidebar avatar as soon as it's
  // uploaded — the admin needs to see it to decide whether to approve it, not
  // only after already approving it.
  useEffect(() => {
    if (!app?.studentPhotoUrl) {
      setAvatarUrl('')
      return
    }
    let cancelled = false
    getSignedDocumentUrl(token, app.id, 'studentPhoto')
      .then(({ url }) => !cancelled && setAvatarUrl(url))
      .catch((err) => {
        if (cancelled) return
        if (err instanceof AuthError) return logout()
        setAvatarUrl('')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app?.id, app?.studentPhotoUrl, token])

  const updateAppLocally = (updated) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const doReview = async (status) => {
    setConfirmState(null)
    setSaving(true)
    setError('')
    try {
      const updated = await updateDocumentReview(token, app.id, selectedDoc, status, comment)
      updateAppLocally(updated)
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || enOnly('admin.verification.updateDocFailed'))
    } finally {
      setSaving(false)
    }
  }

  const handleReview = (status) => {
    if (status === 'rejected') {
      if (!comment.trim()) {
        setError(enOnly('admin.verification.rejectRequiresComment'))
        return
      }
      setConfirmState({
        message: enOnly('admin.verification.confirmReject'),
        tone: 'danger',
        onConfirm: () => doReview(status),
      })
      return
    }
    doReview(status)
  }

  const reviewedCount = docs.filter((d) => {
    const s = app?.documentReviews?.[d.key]?.status
    return s === 'approved' || s === 'rejected'
  }).length
  const total = docs.length
  const pct = total ? Math.round((reviewedCount / total) * 100) : 0
  const allReviewed = total > 0 && reviewedCount === total
  const anyRejected = docs.some((d) => app?.documentReviews?.[d.key]?.status === 'rejected')

  const doComplete = async () => {
    setConfirmState(null)
    setSaving(true)
    setError('')
    try {
      const updated = await updateApplicationStatus(token, app.id, anyRejected ? 'rejected' : 'approved')
      updateAppLocally(updated)
    } catch (err) {
      if (err instanceof AuthError) return logout()
      setError(err.message || enOnly('admin.verification.completeFailed'))
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = () => {
    setConfirmState({
      message: anyRejected
        ? enOnly('admin.verification.confirmCompleteRejected')
        : enOnly('admin.verification.confirmCompleteApproved'),
      tone: anyRejected ? 'danger' : 'default',
      onConfirm: doComplete,
    })
  }

  const goPrev = () => index > 0 && navigate(`/admin/verification/${applications[index - 1].id}`)
  const goNext = () => index < applications.length - 1 && navigate(`/admin/verification/${applications[index + 1].id}`)

  if (loading) {
    return <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] 5xl:max-w-[2000px] 6xl:max-w-[2300px] mx-auto px-6 py-10 text-brand-muted">{enOnly('admin.common.loading')}</div>
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] 5xl:max-w-[2000px] 6xl:max-w-[2300px] mx-auto px-6 py-10">
        <div className="bg-white border border-brand-border rounded-xl p-10 text-center text-brand-muted">
          {enOnly('admin.verification.noApplications')}
        </div>
      </div>
    )
  }

  if (!app) {
    return <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] 5xl:max-w-[2000px] 6xl:max-w-[2300px] mx-auto px-6 py-10 text-brand-muted">{enOnly('admin.common.loading')}</div>
  }

  const selectedDocPath = selectedDoc ? getPath(app, getDocumentFieldPath(selectedDoc)) : null
  const selectedDocHasFile = Boolean(selectedDocPath)
  const selectedDocIsPdf = typeof selectedDocPath === 'string' && selectedDocPath.toLowerCase().endsWith('.pdf')
  const selectedReview = app.documentReviews?.[selectedDoc]
  const selectedDocMeta = docs.find((d) => d.key === selectedDoc)

  return (
    <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] 5xl:max-w-[2000px] 6xl:max-w-[2300px] mx-auto px-6 py-2">
      <ErrorBanner message={error} />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <div className="space-y-6">
          <ApplicantSummaryCard app={app} avatarUrl={avatarUrl} />

          <VerificationProgressCard
            reviewedCount={reviewedCount}
            total={total}
            pct={pct}
            allReviewed={allReviewed}
            saving={saving}
            appStatus={app.status}
            onComplete={handleComplete}
          />
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <DocumentTabs
            docs={docs}
            documentReviews={app.documentReviews}
            selectedDoc={selectedDoc}
            onSelect={setSelectedDoc}
          />

          {selectedDoc && (
            <DocumentReviewPanel
              selectedDocMeta={selectedDocMeta}
              signedUrl={signedUrl}
              signedUrlLoading={signedUrlLoading}
              selectedDocHasFile={selectedDocHasFile}
              selectedDocIsPdf={selectedDocIsPdf}
              comment={comment}
              onCommentChange={setComment}
              selectedReview={selectedReview}
              saving={saving}
              onReview={handleReview}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmState)}
        message={confirmState?.message}
        tone={confirmState?.tone}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  )
}
