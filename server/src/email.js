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
