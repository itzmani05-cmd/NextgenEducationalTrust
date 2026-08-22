import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Download, CheckCircle2, XCircle, Circle,
  ShieldCheck, User,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import {
  listApplications, updateApplicationStatus, updateDocumentReview, getSignedDocumentUrl, AuthError,
} from '../../utils/adminApi.js'
import { getAllRequiredDocuments, getDocumentFieldPath } from '../../utils/documentChecklist.js'
import { getPath } from '../../utils/objectPath.js'
import { enOnly } from '../../i18n/bilingual.js'

const INCOME_LABEL_KEYS = {
  upto_1_5: 'step2.incomeTier1',
  '1_5_to_3': 'step2.incomeTier2',
  '3_to_5': 'step2.incomeTier3',
  above_5: 'step2.incomeTier4',
}

function DocStatusIcon({ status }) {
  if (status === 'approved') return <CheckCircle2 className="w-4 h-4 text-green-600" />
  if (status === 'rejected') return <XCircle className="w-4 h-4 text-brand-red" />
  return <Circle className="w-4 h-4 text-brand-muted" />
}

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
  const docs = app ? getAllRequiredDocuments(app) : []

  useEffect(() => {
    if (!selectedDoc && docs.length > 0) setSelectedDoc(docs[0].key)
  }, [docs, selectedDoc])

  useEffect(() => {
    setComment(app?.documentReviews?.[selectedDoc]?.comment || '')
  }, [app, selectedDoc])

  useEffect(() => {
    const hasPath = app && selectedDoc && getPath(app, selectedDoc)
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

  // Once the admin approves the student's photo, showcase it as the profile
  // avatar in the sidebar instead of the generic placeholder icon.
  useEffect(() => {
    const photoApproved = app?.documentReviews?.studentPhoto?.status === 'approved' && app.studentPhotoUrl
    if (!photoApproved) {
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
  }, [app?.id, app?.documentReviews?.studentPhoto?.status, token])

  const updateAppLocally = (updated) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const handleReview = async (status) => {
    if (status === 'rejected') {
      if (!comment.trim()) {
        setError(enOnly('admin.verification.rejectRequiresComment'))
        return
      }
      if (!window.confirm(enOnly('admin.verification.confirmReject'))) return
    }
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

  const reviewedCount = docs.filter((d) => {
    const s = app?.documentReviews?.[d.key]?.status
    return s === 'approved' || s === 'rejected'
  }).length
  const total = docs.length
  const pct = total ? Math.round((reviewedCount / total) * 100) : 0
  const allReviewed = total > 0 && reviewedCount === total
  const anyRejected = docs.some((d) => app?.documentReviews?.[d.key]?.status === 'rejected')

  const handleComplete = async () => {
    const confirmMessage = anyRejected
      ? enOnly('admin.verification.confirmCompleteRejected')
      : enOnly('admin.verification.confirmCompleteApproved')
    if (!window.confirm(confirmMessage)) return

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

  const goPrev = () => index > 0 && navigate(`/admin/verification/${applications[index - 1].id}`)
  const goNext = () => index < applications.length - 1 && navigate(`/admin/verification/${applications[index + 1].id}`)

  if (loading) {
    return <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 py-10 text-brand-muted">{enOnly('admin.common.loading')}</div>
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 py-10">
        <div className="bg-white border border-brand-border rounded-xl p-10 text-center text-brand-muted">
          {enOnly('admin.verification.noApplications')}
        </div>
      </div>
    )
  }

  if (!app) {
    return <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 py-10 text-brand-muted">{enOnly('admin.common.loading')}</div>
  }

  const selectedDocHasFile = selectedDoc ? Boolean(getPath(app, selectedDoc)) : false
  const selectedReview = app.documentReviews?.[selectedDoc]
  const selectedDocMeta = docs.find((d) => d.key === selectedDoc)

  return (
    <div className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 py-2">
      {error && (
        <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white border border-brand-border rounded-xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center mx-auto mb-2 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-9 h-9" />
              )}
            </div>
            <h2 className="font-bold text-brand-text text-lg">{app.fullName}  
              <span className="text-xs text-brand-muted"> - APP-{app.id.slice(0, 8).toUpperCase()}</span>
            </h2>

            <div className="text-left space-y-3 pt-4 border-t border-brand-border">
              <div>
                <p className="text-xs text-brand-muted">{enOnly('admin.verification.course')}</p>
                <p className="text-sm font-medium text-brand-text">{app.college?.degree || enOnly('admin.common.dash')}</p>
              </div>
              <div>
                <p className="text-xs text-brand-muted">{enOnly('admin.verification.institution')}</p>
                <p className="text-sm font-medium text-brand-text">{app.college?.name || enOnly('admin.common.dash')}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-brand-muted">{enOnly('admin.verification.annualIncome')}</p>
                <p className="text-sm font-medium text-brand-text">
                  {INCOME_LABEL_KEYS[app.annualIncome] ? enOnly(INCOME_LABEL_KEYS[app.annualIncome]) : enOnly('admin.common.dash')}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-brand-muted">{enOnly('admin.verification.submissionDate')}</p>
                <p className="text-sm font-medium text-brand-text">
                  {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-brand-navy" />
              <h3 className="font-semibold text-brand-text text-sm">{enOnly('admin.verification.verificationProgress')}</h3>
            </div>
            <div className="h-2 bg-brand-surface rounded-full overflow-hidden mb-2">
              <div className="h-full bg-brand-navy rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-brand-muted mb-4">
              <span>{reviewedCount} {enOnly('admin.verification.ofDocuments').replace('{total}', total)}</span>
              <span>{pct}%</span>
            </div>
            <button
              type="button"
              onClick={handleComplete}
              disabled={!allReviewed || saving || app.status === 'approved' || app.status === 'rejected'}
              className="w-full bg-brand-navy text-white text-sm font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {app.status === 'approved' || app.status === 'rejected' ? enOnly('admin.verification.verificationComplete') : enOnly('admin.verification.completeVerification')}
            </button>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-1 border-b border-brand-border overflow-x-auto px-2 pt-2">
            {docs.map((doc) => {
              const status = app.documentReviews?.[doc.key]?.status
              const active = doc.key === selectedDoc
              return (
                <button
                  key={doc.key}
                  type="button"
                  onClick={() => setSelectedDoc(doc.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    active ? 'border-brand-navy text-brand-navy' : 'border-transparent text-brand-muted hover:text-brand-text'
                  }`}
                >
                  <DocStatusIcon status={status} />
                  {enOnly(doc.labelKey)}
                </button>
              )
            })}
          </div>

          {selectedDoc && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-brand-text">{selectedDocMeta ? enOnly(selectedDocMeta.labelKey) : ''}</h3>
                {signedUrl && (
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
                  >
                    <Download className="w-4 h-4" /> {enOnly('admin.verification.download')}
                  </a>
                )}
              </div>

              <div className=" border border-brand-border rounded-xl h-80 flex items-center justify-center mb-6">
                {!selectedDocHasFile && (
                  <p className="text-sm text-brand-muted">{enOnly('admin.verification.documentNotUploaded')}</p>
                )}
                {selectedDocHasFile && signedUrlLoading && (
                  <p className="text-sm text-brand-muted">{enOnly('admin.verification.loadingDocument')}</p>
                )}
                {selectedDocHasFile && !signedUrlLoading && signedUrl && (
                  <img src={signedUrl} alt="" className="max-h-full max-w-full object-contain rounded-lg" />
                )}
                {selectedDocHasFile && !signedUrlLoading && !signedUrl && (
                  <p className="text-sm text-brand-red">{enOnly('admin.verification.loadDocFailed')}</p>
                )}
              </div>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-brand-text mb-1.5">
                  {enOnly('admin.verification.reviewerComments')}
                </span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={1}
                  placeholder={enOnly('admin.verification.reviewerCommentsPlaceholder')}
                  className="w-full rounded-lg border border-brand-border px-3.5 py-21 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
                />
              </label>

              {selectedReview?.status && selectedReview.status !== 'pending' && (
                <p className="text-xs text-brand-muted mb-4">
                  {enOnly('admin.verification.currentlyMarked')} <span className="font-semibold">{selectedReview.status}</span>.
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleReview('rejected')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 border border-brand-red text-brand-red px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <XCircle className="w-4 h-4" /> {enOnly('admin.verification.rejectDocument')}
                </button>
                <button
                  type="button"
                  onClick={() => handleReview('approved')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" /> {enOnly('admin.verification.approveDocument')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
