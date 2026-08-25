import { Resend } from 'resend'

let client = null
function getResend() {
  if (client) return client
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set.')
  client = new Resend(apiKey)
  return client
}

// Emails the PDF receipt to the donor once their donation has been verified.
// Delivery is best-effort — a failure here never undoes the verification
// itself (see PATCH /:id/status), it's just logged for a manual retry.
export async function sendDonationReceiptEmail(donation, pdfBuffer) {
  const from = process.env.RESEND_FROM_EMAIL || 'NextGen Solutions Educational Trust <onboarding@resend.dev>'

  const { error } = await getResend().emails.send({
    from,
    to: donation.email,
    subject: `Your Donation Receipt — ${donation.receiptNumber}`,
    html: `
      <p>Dear ${donation.fullName},</p>
      <p>Thank you for your generous donation of <strong>₹${donation.amount.toLocaleString('en-IN')}</strong>
      towards <strong>${donation.purpose}</strong>. We truly appreciate your support.</p>
      <p>Your official donation receipt is attached to this email for your records.</p>
      <p>With gratitude,<br/>NextGen Solutions Educational Trust</p>
    `,
    attachments: [
      { filename: `${donation.receiptNumber.replace(/\//g, '-')}.pdf`, content: pdfBuffer.toString('base64') },
    ],
  })

  if (error) throw new Error(error.message || 'Failed to send donation receipt email.')
}

const SITE_URL = process.env.SITE_URL || 'https://nextgen-educational-trust.vercel.app'
const TRUST_SIGNOFF = 'With regards,<br/>NextGen Solutions Educational Trust'

async function send({ to, subject, html, attachments }) {
  const from = process.env.RESEND_FROM_EMAIL || 'NextGen Solutions Educational Trust <onboarding@resend.dev>'
  const { error } = await getResend().emails.send({ from, to, subject, html, attachments })
  if (error) throw new Error(error.message || `Failed to send email: ${subject}`)
}

// Sent once an admin completes document verification (PATCH /:id/status),
// i.e. the moment `status` becomes 'approved' or 'rejected' — never on the
// intermediate 'submitted' / 'under_review' states.
export async function sendVerificationDecisionEmail(application, status) {
  const isApproved = status === 'approved'
  const subject = isApproved
    ? 'Your Scholarship Application Has Been Approved'
    : 'Update on Your Scholarship Application'

  const body = isApproved
    ? `<p>Great news — your application has been reviewed and <strong>approved</strong>. We will be in touch shortly with the next steps for your fee concession and payment.</p>`
    : `<p>Your application has been reviewed and, unfortunately, was <strong>not approved</strong> at this time. You can check your application for reviewer comments on each document.</p>`

  await send({
    to: application.email,
    subject,
    html: `
      <p>Dear ${application.fullName},</p>
      ${body}
      <p>You can check your full application status here: <a href="${SITE_URL}/status">${SITE_URL}/status</a></p>
      <p>${TRUST_SIGNOFF}</p>
    `,
  })
}

// Sent when an admin approves a student's submitted payment. The fee receipt
// PDF is attached when available (pdfBuffer may be omitted if receipt
// generation failed — see PATCH /:id/payment/approve, which treats that as
// best-effort and still approves the payment).
export async function sendPaymentApprovedEmail(application, payment, pdfBuffer) {
  await send({
    to: application.email,
    subject: 'Your Payment Has Been Approved',
    html: `
      <p>Dear ${application.fullName},</p>
      <p>We've confirmed your payment of <strong>₹${Number(payment.amountPaid).toLocaleString('en-IN')}</strong>.
      ${pdfBuffer ? 'Your fee receipt is attached to this email for your records.' : 'Your fee receipt will be issued shortly.'}</p>
      <p>You can check your full application status here: <a href="${SITE_URL}/status">${SITE_URL}/status</a></p>
      <p>${TRUST_SIGNOFF}</p>
    `,
    attachments: pdfBuffer
      ? [{ filename: `${(payment.receiptNumber || 'receipt').replace(/\//g, '-')}.pdf`, content: pdfBuffer.toString('base64') }]
      : undefined,
  })
}

// Sent when an admin rejects a student's submitted payment, so they know to
// resubmit with corrected details.
export async function sendPaymentRejectedEmail(application, payment) {
  await send({
    to: application.email,
    subject: 'Action Needed: Your Payment Submission Was Rejected',
    html: `
      <p>Dear ${application.fullName},</p>
      <p>We were unable to verify your recent payment submission. Reason: <strong>${payment.rejectionReason}</strong></p>
      <p>Please resubmit your payment details here: <a href="${SITE_URL}/payment">${SITE_URL}/payment</a></p>
      <p>${TRUST_SIGNOFF}</p>
    `,
  })
}
