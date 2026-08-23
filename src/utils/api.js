import { stripFiles, collectFiles } from './objectPath.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// The wizard collects address as door no / street / place / pincode for a
// better filling experience, but the server column is a single string —
// compose it here rather than changing the schema.
function formatAddress(address) {
  if (!address || typeof address !== 'object') return address || ''
  const { doorNo, street, place, pincode } = address
  const line = [doorNo, street, place].filter(Boolean).join(', ')
  return pincode ? `${line} - ${pincode}` : line
}

export async function uploadDocument(applicationId, docKey, file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(
    `${API_BASE_URL}/api/applications/${applicationId}/documents/${encodeURIComponent(docKey)}`,
    { method: 'POST', body: formData },
  )

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || `Failed to upload ${docKey}.`)
  }
  return body
}

// Creates the application record, then uploads every attached file. The
// record is considered submitted once it's created — individual upload
// failures are reported back rather than failing the whole submission,
// since the applicant can retry a specific document from the status page.
export async function submitApplication(data, accessToken) {
  const payload = { ...stripFiles(data), address: formatAddress(data.address) }

  const res = await fetch(`${API_BASE_URL}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to submit application.')
  }

  const files = collectFiles(data)
  const results = await Promise.allSettled(
    files.map(({ key, file }) => uploadDocument(body.id, key, file)),
  )

  const failedUploads = files
    .map(({ key }, i) => ({ key, ok: results[i].status === 'fulfilled' }))
    .filter((r) => !r.ok)
    .map((r) => r.key)

  return { application: body, failedUploads }
}

// Checks whether the signed-in Google account already has an application on
// file, so the wizard can be gated up front instead of only failing at submit.
export async function getMyApplication(accessToken) {
  const res = await fetch(`${API_BASE_URL}/api/applications/mine`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to check your application status.')
  }
  return body.application
}

// Submits (or resubmits, after a rejection) payment details for an approved
// application. The payable amount is computed server-side from the
// admin-approved concession — never sent from here.
export async function submitPayment(applicationId, accessToken, { transactionId, paymentDate, paymentMethod, amountPaid, proof }) {
  const formData = new FormData()
  formData.append('transactionId', transactionId)
  formData.append('paymentDate', paymentDate)
  formData.append('paymentMethod', paymentMethod)
  formData.append('amountPaid', amountPaid)
  formData.append('proof', proof)

  const res = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/payment`, {
    method: 'POST',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: formData,
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to submit payment.')
  }
  return body
}

// Signed download URL for the applicant's own certificate.
export async function getCertificateSignedUrl(applicationId, accessToken) {
  const res = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/certificate/signed-url`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to get certificate download link.')
  }
  return body
}

// Signed download URL for the applicant's own fee receipt.
export async function getFeeReceiptSignedUrl(applicationId, accessToken) {
  const res = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/payment/receipt-signed-url`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to get fee receipt download link.')
  }
  return body
}

export async function submitDonation({ fullName, email, mobile, amount, purpose, pan, transactionRef }) {
  const res = await fetch(`${API_BASE_URL}/api/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, mobile, amount, purpose, pan, transactionRef }),
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to submit donation.')
  }
  return body
}

export async function lookupApplication(mobile, email) {
  const res = await fetch(`${API_BASE_URL}/api/applications/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, email }),
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to look up application.')
  }
  return body
}
