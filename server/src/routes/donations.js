import { Router } from 'express'
import { prisma } from '../prismaClient.js'
import { requireAdmin } from '../auth.js'
import { logAudit } from '../audit.js'
import { issueReceiptForDonation } from '../receipt.js'
import { sendDonationReceiptEmail } from '../email.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from '../supabaseAdmin.js'

const router = Router()

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/
const STATUS_VALUES = ['verified', 'rejected']

// Public — a donor submits their details after paying via QR/UPI on the
// Donate page. No auth required; this is a self-reported confirmation the
// Trust cross-checks against the actual bank/UPI statement before verifying.
router.post('/', async (req, res) => {
  const { fullName, email, mobile, amount, purpose, pan, transactionRef } = req.body

  const cleanFullName = String(fullName || '').trim()
  const cleanEmail = String(email || '').trim()
  const cleanMobile = String(mobile || '').trim()
  const cleanPurpose = String(purpose || '').trim()
  const cleanTransactionRef = String(transactionRef || '').trim()
  const cleanPan = String(pan || '').trim().toUpperCase()
  const parsedAmount = Number(amount)

  if (!cleanFullName) {
    return res.status(400).json({ error: 'Full name is required.' })
  }
  if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'A valid email address is required.' })
  }
  if (!/^\d{10}$/.test(cleanMobile)) {
    return res.status(400).json({ error: 'A valid 10-digit mobile number is required.' })
  }
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'A valid donation amount is required.' })
  }
  if (!cleanPurpose) {
    return res.status(400).json({ error: 'Purpose is required.' })
  }
  if (cleanPan && !PAN_PATTERN.test(cleanPan)) {
    return res.status(400).json({ error: 'PAN format should be like ABCDE1234F.' })
  }
  if (!cleanTransactionRef) {
    return res.status(400).json({ error: 'Transaction reference number is required.' })
  }

  try {
    const donation = await prisma.donation.create({
      data: {
        fullName: cleanFullName,
        email: cleanEmail,
        mobile: cleanMobile,
        amount: Math.round(parsedAmount),
        purpose: cleanPurpose,
        pan: cleanPan || null,
        transactionRef: cleanTransactionRef,
      },
    })
    res.status(201).json(donation)
  } catch (err) {
    console.error('Failed to save donation:', err)
    res.status(500).json({ error: 'Failed to save donation.' })
  }
})

router.get('/', requireAdmin, async (req, res) => {
  const { status } = req.query

  try {
    const donations = await prisma.donation.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    res.json(donations)
  } catch (err) {
    console.error('Failed to list donations:', err)
    res.status(500).json({ error: 'Failed to list donations.' })
  }
})

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status, rejectionReason } = req.body

  if (!STATUS_VALUES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUS_VALUES.join(', ')}` })
  }
  if (status === 'rejected' && !String(rejectionReason || '').trim()) {
    return res.status(400).json({ error: 'A rejection reason is required.' })
  }

  try {
    const existing = await prisma.donation.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Donation not found.' })

    let donation = await prisma.donation.update({
      where: { id: req.params.id },
      data: {
        status,
        verifiedByEmail: req.admin.email,
        verifiedAt: new Date(),
        rejectionReason: status === 'rejected' ? String(rejectionReason).trim() : null,
      },
    })

    await logAudit({
      adminEmail: req.admin.email,
      action: status === 'verified' ? 'DONATION_VERIFIED' : 'DONATION_REJECTED',
      oldStatus: existing.status,
      newStatus: status,
      remarks: status === 'rejected' ? String(rejectionReason).trim() : null,
      newValue: { donationId: donation.id },
    })

    // Receipt + email are best-effort here: verification itself is already
    // committed and correct even if PDF/email delivery hiccups — an admin
    // can retry by re-verifying, since issueReceiptForDonation is idempotent.
    if (status === 'verified') {
      try {
        const { donation: withReceipt, pdfBuffer } = await issueReceiptForDonation(donation)
        donation = withReceipt
        await sendDonationReceiptEmail(donation, pdfBuffer)
        donation = await prisma.donation.update({
          where: { id: donation.id },
          data: { receiptEmailSentAt: new Date() },
        })
      } catch (receiptErr) {
        console.error('Donation verified but receipt/email failed:', receiptErr)
      }
    }

    res.json(donation)
  } catch (err) {
    console.error('Failed to update donation status:', err)
    res.status(500).json({ error: 'Failed to update donation status.' })
  }
})

// Verification itself never fails just because the receipt email didn't send
// (e.g. RESEND_FROM_EMAIL not yet on a verified domain) — that failure is
// only logged server-side, leaving the donation stuck showing "pending" in
// the admin UI with no way to retry. This lets an admin retry it directly,
// once the underlying delivery problem is fixed, without re-verifying.
router.post('/:id/receipt/retry-email', requireAdmin, async (req, res) => {
  try {
    const donation = await prisma.donation.findUnique({ where: { id: req.params.id } })
    if (!donation) return res.status(404).json({ error: 'Donation not found.' })
    if (donation.status !== 'verified') {
      return res.status(400).json({ error: 'Only a verified donation has a receipt to email.' })
    }

    const { donation: withReceipt, pdfBuffer } = await issueReceiptForDonation(donation)
    await sendDonationReceiptEmail(withReceipt, pdfBuffer)
    const updated = await prisma.donation.update({
      where: { id: donation.id },
      data: { receiptEmailSentAt: new Date() },
    })

    res.json(updated)
  } catch (err) {
    console.error('Failed to retry donation receipt email:', err)
    res.status(500).json({ error: err.message || 'Failed to send the receipt email.' })
  }
})

router.get('/:id/receipt/signed-url', requireAdmin, async (req, res) => {
  try {
    const donation = await prisma.donation.findUnique({ where: { id: req.params.id } })
    if (!donation?.receiptPath) return res.status(404).json({ error: 'Receipt not available yet.' })

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(donation.receiptPath, 30 * 60)
    if (error) throw error

    res.json({ url: data.signedUrl, receiptNumber: donation.receiptNumber })
  } catch (err) {
    console.error('Failed to create receipt signed URL:', err)
    res.status(500).json({ error: 'Failed to create signed URL.' })
  }
})

export default router
