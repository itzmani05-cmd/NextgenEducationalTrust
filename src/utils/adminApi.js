const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
export const ADMIN_TOKEN_KEY = 'ngc_admin_token'

export class AuthError extends Error {}

export async function request(path, { token, method = 'GET', body } = {}) {
  const isForm = body instanceof FormData
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    throw new AuthError('Your session has expired. Please log in again.')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed.')
  }
  return data
}

export function adminLogin(password) {
  return request('/api/auth/login', { method: 'POST', body: { password } })
}

export function listApplications(token, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return request(`/api/applications${query}`, { token })
}

export function listDonations(token, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return request(`/api/donations${query}`, { token })
}

export function updateDonationStatus(token, id, status, rejectionReason) {
  return request(`/api/donations/${id}/status`, { token, method: 'PATCH', body: { status, rejectionReason } })
}

export function getDonationReceiptSignedUrl(token, id) {
  return request(`/api/donations/${id}/receipt/signed-url`, { token })
}

export function retryDonationReceiptEmail(token, id) {
  return request(`/api/donations/${id}/receipt/retry-email`, { token, method: 'POST' })
}

export function listExpenses(token) {
  return request('/api/expenses', { token })
}

function expenseFormData({ bill, removeBill, ...fields }) {
  const formData = new FormData()
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value ?? ''))
  if (bill) formData.append('bill', bill)
  if (removeBill) formData.append('removeBill', 'true')
  return formData
}

export function createExpense(token, data) {
  return request('/api/expenses', { token, method: 'POST', body: expenseFormData(data) })
}

export function updateExpense(token, id, data) {
  return request(`/api/expenses/${id}`, { token, method: 'PATCH', body: expenseFormData(data) })
}

export function deleteExpense(token, id) {
  return request(`/api/expenses/${id}`, { token, method: 'DELETE' })
}

export function getExpenseBillSignedUrl(token, id) {
  return request(`/api/expenses/${id}/bill/signed-url`, { token })
}

export function listExpenseCategories(token) {
  return request('/api/expenses/categories', { token })
}

export function createExpenseCategory(token, { name, icon }) {
  return request('/api/expenses/categories', { token, method: 'POST', body: { name, icon } })
}

export function updateExpenseCategory(token, id, { name, icon }) {
  return request(`/api/expenses/categories/${id}`, { token, method: 'PATCH', body: { name, icon } })
}

export function deleteExpenseCategory(token, id) {
  return request(`/api/expenses/categories/${id}`, { token, method: 'DELETE' })
}

export function getApplication(token, id) {
  return request(`/api/applications/${id}`, { token })
}

export function updateApplicationStatus(token, id, status) {
  return request(`/api/applications/${id}/status`, { token, method: 'PATCH', body: { status } })
}

export function deleteApplication(token, id) {
  return request(`/api/applications/${id}`, { token, method: 'DELETE' })
}

export function updateConcession(token, id, { category, finalApprovedConcession, note, courseFee }) {
  return request(`/api/applications/${id}/concession`, {
    token,
    method: 'PATCH',
    body: { category, finalApprovedConcession, note, courseFee },
  })
}

export function approvePayment(token, id, remarks) {
  return request(`/api/applications/${id}/payment/approve`, { token, method: 'PATCH', body: { remarks } })
}

export function rejectPayment(token, id, reason) {
  return request(`/api/applications/${id}/payment/reject`, { token, method: 'PATCH', body: { reason } })
}

export function getPaymentProofSignedUrl(token, id) {
  return request(`/api/applications/${id}/payment/proof-signed-url`, { token })
}

export function updateDocumentReview(token, id, docKey, status, comment) {
  return request(`/api/applications/${id}/documents/${encodeURIComponent(docKey)}`, {
    token,
    method: 'PATCH',
    body: { status, comment },
  })
}

export function getSignedDocumentUrl(token, id, docKey) {
  return request(`/api/applications/${id}/documents/${encodeURIComponent(docKey)}/signed-url`, { token })
}

export async function downloadApplicationPdf(token, id) {
  const res = await fetch(`${API_BASE_URL}/api/applications/${id}/application-pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (res.status === 401) {
    throw new AuthError('Your session has expired. Please log in again.')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error || 'Failed to download the application.')
  }

  const disposition = res.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match ? match[1] : `application-${id.slice(0, 8)}.pdf`

  return { blob: await res.blob(), filename }
}

export function listStaff(token) {
  return request('/api/admin/staff', { token })
}

export function createStaff(token, data) {
  return request('/api/admin/staff', { token, method: 'POST', body: data })
}

export function getStaff(token, id) {
  return request(`/api/admin/staff/${id}`, { token })
}

export function updateStaff(token, id, data) {
  return request(`/api/admin/staff/${id}`, { token, method: 'PATCH', body: data })
}

export function resetStaffPassword(token, id) {
  return request(`/api/admin/staff/${id}/reset-password`, { token, method: 'POST' })
}

export function getStaffDocumentSignedUrl(token, id, docId) {
  return request(`/api/admin/staff/${id}/documents/${docId}/signed-url`, { token })
}

export function listStaffWorkLogs(token, id, month) {
  return request(`/api/admin/staff/${id}/work-logs?month=${encodeURIComponent(month)}`, { token })
}

export function listPendingWorkLogs(token) {
  return request('/api/admin/staff/work-logs/pending', { token })
}

export function reviewWorkLog(token, logId, { status, rejectionReason }) {
  return request(`/api/admin/staff/work-logs/${logId}`, { token, method: 'PATCH', body: { status, rejectionReason } })
}

export function listStaffPayouts(token, id) {
  return request(`/api/admin/staff/${id}/payouts`, { token })
}

export function createStaffPayout(token, id, data) {
  return request(`/api/admin/staff/${id}/payouts`, { token, method: 'POST', body: data })
}
