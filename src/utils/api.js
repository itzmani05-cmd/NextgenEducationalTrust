import { stripFiles } from './objectPath.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

export async function createApplication(data, accessToken) {
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
  return body
}

export async function finalizeApplication(applicationId) {
  const res = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/finalize`, {
    method: 'POST',
  })

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(body?.error || 'Failed to submit application.')
  }
  return body
}

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
