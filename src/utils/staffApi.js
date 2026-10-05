import { request } from './adminApi.js'

export { AuthError } from './adminApi.js'

export const STAFF_TOKEN_KEY = 'ngc_staff_token'

export function staffLogin(staffCode, password) {
  return request('/api/staff-auth/login', { method: 'POST', body: { staffCode, password } })
}

export function changeStaffPassword(token, currentPassword, newPassword) {
  return request('/api/staff-auth/change-password', { token, method: 'POST', body: { currentPassword, newPassword } })
}

export function getMyProfile(token) {
  return request('/api/staff/me', { token })
}

export function updateMyProfile(token, data) {
  return request('/api/staff/me', { token, method: 'PATCH', body: data })
}

export function uploadMyDocument(token, kind, file) {
  const formData = new FormData()
  formData.append('kind', kind)
  formData.append('file', file)
  return request('/api/staff/me/documents', { token, method: 'POST', body: formData })
}

export function deleteMyDocument(token, docId) {
  return request(`/api/staff/me/documents/${docId}`, { token, method: 'DELETE' })
}

export function getMyDocumentSignedUrl(token, docId) {
  return request(`/api/staff/me/documents/${docId}/signed-url`, { token })
}

export function listMyWorkLogs(token, month) {
  return request(`/api/staff/me/work-logs?month=${encodeURIComponent(month)}`, { token })
}

export function createMyWorkLog(token, data) {
  return request('/api/staff/me/work-logs', { token, method: 'POST', body: data })
}

export function updateMyWorkLog(token, id, data) {
  return request(`/api/staff/me/work-logs/${id}`, { token, method: 'PATCH', body: data })
}

export function deleteMyWorkLog(token, id) {
  return request(`/api/staff/me/work-logs/${id}`, { token, method: 'DELETE' })
}

export function listMyPayouts(token) {
  return request('/api/staff/me/payouts', { token })
}
