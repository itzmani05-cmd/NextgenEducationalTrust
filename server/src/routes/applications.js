import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { mapApplicationPayload } from '../applicationPayload.js'
import { requireAdmin, requireApplicantAuth, requireAdminOrOwner } from '../auth.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from '../supabaseAdmin.js'
import {
  isKnownDocumentKey, buildDocumentUrlPatch, getDocumentPath, getDocumentPresenceMap,
} from '../documentFieldPatch.js'
import { getProvisional } from '../scholarshipCalc.js'
import { logAudit } from '../audit.js'
import { issueCertificateForApplication } from '../certificate.js'
import { renderApplicationPdf } from '../applicationPdf.js'

const router = Router()

// Only 'approved'/'rejected'/'under_review' are settable via the generic
// PATCH /:id/status route below — the payment_* and certificate_issued
// states are only ever reached through their dedicated endpoints further
// down, each with its own validation, so the state machine can't be skipped.
const STATUS_VALUES = ['submitted', 'under_review', 'approved', 'rejected']
const DOC_STATUS_VALUES = ['pending', 'approved', 'rejected']
const PAYMENT_METHODS = ['upi', 'bank_transfer', 'other']
const PROOF_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
})

router.post('/', requireApplicantAuth, async (req, res) => {
  const { fullName, mobile, email } = req.body

  if (!fullName || !mobile || !email) {
    return res.status(400).json({ error: 'fullName, mobile, and email are required.' })
  }

  try {
    // One application per Google account — re-check right before creating so
    // a race between two near-simultaneous submits can't both slip through.
    const existing = await prisma.application.findFirst({
      where: { authUserId: req.authUser.id },
    })
    if (existing) {
      return res.status(409).json({
        error: 'You have already submitted an application with this Google account.',
        application: existing,
      })
    }

    const application = await prisma.application.create({
      data: {
        ...mapApplicationPayload(req.body),
        authUserId: req.authUser.id,
        authEmail: req.authUser.email,
      },
    })
    res.status(201).json(application)
  } catch (err) {
    console.error('Failed to create application:', err)
    res.status(500).json({ error: 'Failed to create application.' })
  }
})

// Lets the applicant's own client check whether they've already applied,
// so the wizard can be gated up front instead of only failing at submit time.
router.get('/mine', requireApplicantAuth, async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: { authUserId: req.authUser.id },
      orderBy: { createdAt: 'desc' },
      include: { payment: true, certificate: true },
    })
    res.json({ application: application || null })
  } catch (err) {
    console.error('Failed to look up your application:', err)
    res.status(500).json({ error: 'Failed to look up your application.' })
  }
})

// Public status lookup for applicants — no auth, but requires knowing both
// the mobile number and email on file, and returns a curated view only
// (no family/financial details, no raw document paths).
router.post('/lookup', async (req, res) => {
  const { mobile, email } = req.body

  if (!mobile || !email) {
    return res.status(400).json({ error: 'mobile and email are required.' })
  }

  try {
    const matches = await prisma.application.findMany({
      where: {
        mobile: String(mobile).trim(),
        email: { equals: String(email).trim(), mode: 'insensitive' },
      },
      include: { payment: true, certificate: true },
    })

    if (matches.length !== 1) {
      return res.status(404).json({ error: 'No matching application found.' })
    }

    const app = matches[0]
    const stripDocPaths = (obj) => {
      if (!obj) return obj
      const { markSheet, bonafide, ...rest } = obj
      return rest
    }

    res.json({
      id: app.id,
      fullName: app.fullName,
      status: app.status,
      createdAt: app.createdAt,
      bothParentsDeceased: app.bothParentsDeceased,
      singleParent: app.singleParent,
      hasDiploma: app.hasDiploma,
      tamilMediumTill12: app.tamilMediumTill12,
      socialCategory: app.socialCategory,
      selfEarning: app.selfEarning,
      existingScholarship: app.existingScholarship,
      tenth: stripDocPaths(app.tenth),
      twelfth: stripDocPaths(app.twelfth),
      college: stripDocPaths(app.college),
      documentReviews: app.documentReviews || {},
      documentPresence: getDocumentPresenceMap(app),
      // Only surface the Trust's final decision, once recorded — never the
      // provisional calculatedConcession, and never the internal committee note.
      concession: app.finalApprovedConcession != null
        ? { category: app.concessionCategory, percentage: app.finalApprovedConcession }
        : null,
      // Read-only summary — no proof/certificate file paths. Submitting a
      // payment or downloading the certificate requires signing in (see
      // /profile and /payment), since those need requireApplicantAuth.
      payment: app.payment
        ? {
          status: app.payment.status,
          amountDue: app.payment.amountDue,
          amountPaid: app.payment.amountPaid,
          rejectionReason: app.payment.rejectionReason,
          verifiedAt: app.payment.verifiedAt,
        }
        : null,
      certificate: app.certificate
        ? { certificateNumber: app.certificate.certificateNumber, issuedAt: app.certificate.issuedAt }
        : null,
    })
  } catch (err) {
    console.error('Failed to look up application:', err)
    res.status(500).json({ error: 'Failed to look up application.' })
  }
})

router.get('/', requireAdmin, async (req, res) => {
  const { status } = req.query

  try {
    const applications = await prisma.application.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    res.json(applications)
  } catch (err) {
    console.error('Failed to list applications:', err)
    res.status(500).json({ error: 'Failed to list applications.' })
  }
})

router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { payment: true, certificate: true },
    })
    if (!application) return res.status(404).json({ error: 'Application not found.' })
    res.json(application)
  } catch (err) {
    console.error('Failed to fetch application:', err)
    res.status(500).json({ error: 'Failed to fetch application.' })
  }
})

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body

  if (!STATUS_VALUES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUS_VALUES.join(', ')}` })
  }

  try {
    const data = { status }

    // The moment an application is accepted, run the provisional discount
    // calculation from the applicant's own answers — separate from whatever
    // the Trust ultimately approves via PATCH /:id/concession.
    if (status === 'approved') {
      const existing = await prisma.application.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ error: 'Application not found.' })
      data.calculatedConcession = getProvisional(existing).provisional
    }

    const before = await prisma.application.findUnique({ where: { id: req.params.id } })
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data,
    })

    if (status === 'rejected') {
      await logAudit({
        adminEmail: req.admin.email, applicationId: application.id,
        action: 'APPLICATION_REJECTED', oldStatus: before?.status, newStatus: status,
      })
    }

    res.json(application)
  } catch (err) {
    console.error('Failed to update application status:', err)
    res.status(500).json({ error: 'Failed to update application status.' })
  }
})

const CONCESSION_CATEGORIES = ['category1', 'category2', 'category3', 'category4', 'exceptional']

// Records the Trust's final concession decision. Only allowed once the
// application has been accepted (calculatedConcession will already be set
// from the status route above) — the Trust reviews/confirms or overrides it.
router.patch('/:id/concession', requireAdmin, async (req, res) => {
  const { category, finalApprovedConcession, note, courseFee } = req.body

  if (!CONCESSION_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CONCESSION_CATEGORIES.join(', ')}` })
  }
  const amount = Number(finalApprovedConcession)
  if (!Number.isInteger(amount) || amount < 0 || amount > 100) {
    return res.status(400).json({ error: 'finalApprovedConcession must be an integer between 0 and 100.' })
  }
  const fee = Number(courseFee)
  if (!Number.isInteger(fee) || fee <= 0) {
    return res.status(400).json({ error: 'courseFee must be a positive integer — the payable amount is computed from it.' })
  }

  try {
    const existing = await prisma.application.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Application not found.' })
    if (existing.status !== 'approved') {
      return res.status(400).json({ error: 'Accept the application before recording a concession decision.' })
    }

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        concessionCategory: category,
        finalApprovedConcession: amount,
        concessionNote: note ? String(note).trim() : null,
        concessionDecidedAt: new Date(),
        concessionApprovedByEmail: req.admin.email,
        courseFee: fee,
      },
    })

    await logAudit({
      adminEmail: req.admin.email, applicationId: application.id, action: 'CONCESSION_APPROVED',
      oldValue: { finalApprovedConcession: existing.finalApprovedConcession, courseFee: existing.courseFee },
      newValue: { category, finalApprovedConcession: amount, courseFee: fee },
      remarks: note || null,
    })

    res.json(application)
  } catch (err) {
    console.error('Failed to update concession decision:', err)
    res.status(500).json({ error: 'Failed to update concession decision.' })
  }
})

router.patch('/:id/documents/:docKey', requireAdmin, async (req, res) => {
  const { status, comment } = req.body

  if (!DOC_STATUS_VALUES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${DOC_STATUS_VALUES.join(', ')}` })
  }

  try {
    const existing = await prisma.application.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Application not found.' })

    const documentReviews = { ...(existing.documentReviews || {}) }
    documentReviews[req.params.docKey] = { status, comment: comment || '' }

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { documentReviews },
    })

    if (status === 'approved' || status === 'rejected') {
      await logAudit({
        adminEmail: req.admin.email, applicationId: application.id,
        action: status === 'approved' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED',
        newValue: { docKey: req.params.docKey, comment: comment || '' },
      })
    }

    res.json(application)
  } catch (err) {
    console.error('Failed to update document review:', err)
    res.status(500).json({ error: 'Failed to update document review.' })
  }
})

// Public — used both right after initial submission (to attach the files a
// student selected during the wizard) and later if a document needs re-upload
// after being rejected. Anyone POSTing needs the application's unguessable
// UUID, which only the applicant (or the Trust) ever sees.
router.post('/:id/documents/:docKey', upload.single('file'), async (req, res) => {
  const { docKey } = req.params

  if (!isKnownDocumentKey(docKey)) {
    return res.status(400).json({ error: 'Unknown document key.' })
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' })
  }

  try {
    const existing = await prisma.application.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Application not found.' })

    const ext = (req.file.originalname.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
    const safeKey = docKey.replace('.', '_')
    const path = `applications/${req.params.id}/${safeKey}-${Date.now()}.${ext}`

    const supabase = getSupabaseAdmin()
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true })
    if (uploadError) throw uploadError

    // A fresh file means any prior review verdict for this document no longer applies.
    const documentReviews = { ...(existing.documentReviews || {}) }
    delete documentReviews[docKey]

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        ...buildDocumentUrlPatch(existing, docKey, path),
        documentReviews,
      },
    })
    res.json(application)
  } catch (err) {
    console.error('Failed to upload document:', err)
    res.status(500).json({ error: 'Failed to upload document.' })
  }
})

router.get('/:id/documents/:docKey/signed-url', requireAdmin, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({ where: { id: req.params.id } })
    if (!application) return res.status(404).json({ error: 'Application not found.' })

    const path = getDocumentPath(application, req.params.docKey)
    if (!path) return res.status(404).json({ error: 'Document not uploaded.' })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(path, 30 * 60)
    if (error) throw error

    res.json({ url: data.signedUrl })
  } catch (err) {
    console.error('Failed to create signed URL:', err)
    res.status(500).json({ error: 'Failed to create signed URL.' })
  }
})

// ---------------------------------------------------------------------------
// Payment + certificate workflow
// ---------------------------------------------------------------------------

// Student submits (or resubmits, after a rejection) their payment details.
// The payable amount is always computed here from the admin-approved
// concession + course fee — the client never gets to set it.
router.post('/:id/payment', requireApplicantAuth, upload.single('proof'), async (req, res) => {
  const { transactionId, paymentDate, paymentMethod, amountPaid } = req.body

  const cleanTransactionId = String(transactionId || '').trim()
  if (cleanTransactionId.length < 3 || cleanTransactionId.length > 100) {
    return res.status(400).json({ error: 'A valid Payment Transaction ID is required.' })
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ error: `paymentMethod must be one of: ${PAYMENT_METHODS.join(', ')}` })
  }
  const parsedDate = new Date(paymentDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: 'A valid Payment Date is required.' })
  }
  const paidAmount = Number(amountPaid)
  if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
    return res.status(400).json({ error: 'Amount Paid must be a positive number.' })
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Payment screenshot / proof is required.' })
  }
  if (!PROOF_MIME_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Payment proof must be a JPEG, PNG, WebP, or PDF file.' })
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { payment: true },
    })
    if (!application || application.authUserId !== req.authUser.id) {
      return res.status(404).json({ error: 'Application not found.' })
    }
    if (application.finalApprovedConcession == null || application.courseFee == null) {
      return res.status(400).json({ error: 'Your concession has not been approved yet — payment is not open.' })
    }
    if (application.payment && ['submitted', 'approved'].includes(application.payment.status)) {
      return res.status(409).json({ error: 'A payment has already been submitted for this application.' })
    }

    // One transaction ID can't be reused across a different application.
    const duplicate = await prisma.payment.findFirst({
      where: { transactionId: cleanTransactionId, applicationId: { not: application.id } },
    })
    if (duplicate) {
      return res.status(409).json({ error: 'This transaction ID has already been submitted for another application.' })
    }

    const amountDue = Math.round(application.courseFee * (100 - application.finalApprovedConcession) / 100)

    const ext = (req.file.originalname.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
    const storagePath = `payments/${application.id}/proof-${Date.now()}.${ext}`
    const supabase = getSupabaseAdmin()
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: true })
    if (uploadError) throw uploadError

    const payment = await prisma.payment.upsert({
      where: { applicationId: application.id },
      create: {
        applicationId: application.id, status: 'submitted', amountDue, amountPaid: paidAmount,
        paymentMethod, transactionId: cleanTransactionId, paymentDate: parsedDate,
        paymentProofPath: storagePath, submittedAt: new Date(),
      },
      update: {
        status: 'submitted', amountDue, amountPaid: paidAmount,
        paymentMethod, transactionId: cleanTransactionId, paymentDate: parsedDate,
        paymentProofPath: storagePath, submittedAt: new Date(),
        verifiedByEmail: null, verifiedAt: null, rejectionReason: null, adminRemarks: null,
      },
    })

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: { status: 'payment_submitted' },
      include: { payment: true, certificate: true },
    })

    res.json(updated)
  } catch (err) {
    console.error('Failed to submit payment:', err)
    res.status(500).json({ error: 'Failed to submit payment.' })
  }
})

router.get('/:id/payment/proof-signed-url', requireAdmin, async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { applicationId: req.params.id } })
    if (!payment?.paymentProofPath) return res.status(404).json({ error: 'Payment proof not found.' })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(payment.paymentProofPath, 30 * 60)
    if (error) throw error

    res.json({ url: data.signedUrl })
  } catch (err) {
    console.error('Failed to create payment proof signed URL:', err)
    res.status(500).json({ error: 'Failed to create signed URL.' })
  }
})

router.patch('/:id/payment/approve', requireAdmin, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { payment: true },
    })
    if (!application) return res.status(404).json({ error: 'Application not found.' })
    const payment = application.payment

    if (application.finalApprovedConcession == null) {
      return res.status(400).json({ error: 'This application does not have an approved concession.' })
    }
    if (!payment || payment.status !== 'submitted') {
      return res.status(400).json({ error: 'There is no submitted payment awaiting approval for this application.' })
    }
    if (!payment.transactionId) {
      return res.status(400).json({ error: 'Payment is missing a transaction ID.' })
    }
    if (payment.amountPaid == null || payment.amountDue == null || payment.amountPaid < payment.amountDue) {
      return res.status(400).json({ error: 'Amount paid is less than the required payable amount.' })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'approved', verifiedByEmail: req.admin.email, verifiedAt: new Date(),
        rejectionReason: null, adminRemarks: req.body?.remarks ? String(req.body.remarks).trim() : payment.adminRemarks,
      },
    })
    let updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: { status: 'payment_approved' },
    })

    await logAudit({
      adminEmail: req.admin.email, applicationId: application.id, paymentId: payment.id,
      action: 'PAYMENT_APPROVED', oldStatus: 'payment_submitted', newStatus: 'payment_approved',
    })

    // Certificate generation is best-effort here: payment approval itself is
    // already committed and correct even if PDF/storage hiccups — an admin
    // can retry via POST /:id/certificate/generate.
    let certificate = null
    try {
      certificate = await issueCertificateForApplication(updatedApplication, updatedPayment, req.admin.email)
      updatedApplication = await prisma.application.update({
        where: { id: application.id },
        data: { status: 'certificate_issued' },
      })
      await logAudit({
        adminEmail: req.admin.email, applicationId: application.id,
        action: 'CERTIFICATE_ISSUED', newValue: { certificateNumber: certificate.certificateNumber },
      })
    } catch (certErr) {
      console.error('Payment approved but certificate generation failed:', certErr)
    }

    res.json({ ...updatedApplication, payment: updatedPayment, certificate })
  } catch (err) {
    console.error('Failed to approve payment:', err)
    res.status(500).json({ error: 'Failed to approve payment.' })
  }
})

router.patch('/:id/payment/reject', requireAdmin, async (req, res) => {
  const reason = String(req.body?.reason || '').trim()
  if (!reason) {
    return res.status(400).json({ error: 'A rejection reason is required.' })
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { payment: true },
    })
    if (!application) return res.status(404).json({ error: 'Application not found.' })
    const payment = application.payment
    if (!payment || payment.status !== 'submitted') {
      return res.status(400).json({ error: 'There is no submitted payment awaiting review for this application.' })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'rejected', rejectionReason: reason, verifiedByEmail: req.admin.email, verifiedAt: new Date() },
    })
    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: { status: 'payment_rejected' },
    })

    await logAudit({
      adminEmail: req.admin.email, applicationId: application.id, paymentId: payment.id,
      action: 'PAYMENT_REJECTED', oldStatus: 'payment_submitted', newStatus: 'payment_rejected', remarks: reason,
    })

    res.json({ ...updatedApplication, payment: updatedPayment })
  } catch (err) {
    console.error('Failed to reject payment:', err)
    res.status(500).json({ error: 'Failed to reject payment.' })
  }
})

// Manual/idempotent trigger — normally certificates are issued automatically
// the moment a payment is approved (see above); this exists to retry after a
// transient failure there, or to re-fetch an already-issued certificate.
router.post('/:id/certificate/generate', requireAdmin, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { payment: true, certificate: true },
    })
    if (!application) return res.status(404).json({ error: 'Application not found.' })
    if (!application.payment || application.payment.status !== 'approved') {
      return res.status(400).json({ error: 'A certificate can only be issued after payment has been approved.' })
    }

    const alreadyExisted = Boolean(application.certificate)
    const certificate = await issueCertificateForApplication(application, application.payment, req.admin.email)

    if (!alreadyExisted) {
      await prisma.application.update({ where: { id: application.id }, data: { status: 'certificate_issued' } })
      await logAudit({
        adminEmail: req.admin.email, applicationId: application.id,
        action: 'CERTIFICATE_ISSUED', newValue: { certificateNumber: certificate.certificateNumber },
      })
    }

    res.json(certificate)
  } catch (err) {
    console.error('Failed to generate certificate:', err)
    res.status(500).json({ error: 'Failed to generate certificate.' })
  }
})

// Either the Trust (admin) or the certificate's own applicant can download it.
router.get(
  '/:id/certificate/signed-url',
  requireAdminOrOwner(async (req) => {
    const application = await prisma.application.findUnique({ where: { id: req.params.id } })
    return application?.authUserId || null
  }),
  async (req, res) => {
    try {
      const certificate = await prisma.certificate.findUnique({ where: { applicationId: req.params.id } })
      if (!certificate?.certificatePath) return res.status(404).json({ error: 'Certificate not available yet.' })

      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(certificate.certificatePath, 30 * 60)
      if (error) throw error

      res.json({ url: data.signedUrl, certificateNumber: certificate.certificateNumber, issuedAt: certificate.issuedAt })
    } catch (err) {
      console.error('Failed to create certificate signed URL:', err)
      res.status(500).json({ error: 'Failed to create signed URL.' })
    }
  },
)

// Full application record as a PDF, for the Trust to keep or share offline.
// Only available once payment has been approved — before that the record is
// still in flux and isn't considered final. Generated fresh on every
// request (not cached) so it always reflects the latest state.
router.get('/:id/application-pdf', requireAdmin, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { payment: true, certificate: true },
    })
    if (!application) return res.status(404).json({ error: 'Application not found.' })
    if (!application.payment || application.payment.status !== 'approved') {
      return res.status(400).json({ error: 'The application download is available once payment has been approved.' })
    }

    const pdfBuffer = await renderApplicationPdf(application)
    const refNumber = `NGC-${application.id.slice(0, 8).toUpperCase()}`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="application-${refNumber}.pdf"`)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('Failed to generate application PDF:', err)
    res.status(500).json({ error: 'Failed to generate the application PDF.' })
  }
})

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.application.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    console.error('Failed to delete application:', err)
    res.status(404).json({ error: 'Application not found.' })
  }
})

export default router
