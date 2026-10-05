import crypto from 'crypto'

export const STAFF_DOCUMENT_KINDS = {
  photo: { label: 'Passport Photo', required: true, imageOnly: true },
  id_proof: { label: 'ID Proof (Aadhaar)', required: true },
  pan_card: { label: 'PAN Card', required: true },
  degree_certificate: { label: 'Degree Certificate', required: true },
  other_certificate: { label: 'Other Certificates', required: false, multiple: true },
  resume: { label: 'Resume / CV', required: true },
  bank_proof: { label: 'Bank Passbook / Cancelled Cheque', required: true },
}

export const STAFF_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
export const STAFF_DOCUMENT_MAX_BYTES = 2 * 1024 * 1024

export const REQUIRED_PROFILE_FIELDS = [
  'phone', 'dob', 'gender', 'address',
  'qualification', 'degree', 'institution', 'passingYear',
  'bankAccountName', 'bankAccountNumber', 'bankIfsc', 'bankName', 'pan',
]

export function profileCompleteness(staff, documents) {
  const fieldsDone = REQUIRED_PROFILE_FIELDS.filter((f) => staff[f] !== null && staff[f] !== undefined && staff[f] !== '').length
  const requiredDocs = Object.entries(STAFF_DOCUMENT_KINDS).filter(([, k]) => k.required).map(([key]) => key)
  const uploaded = new Set(documents.map((d) => d.kind))
  const docsDone = requiredDocs.filter((k) => uploaded.has(k)).length
  const total = REQUIRED_PROFILE_FIELDS.length + requiredDocs.length
  return {
    percent: Math.round(((fieldsDone + docsDone) / total) * 100),
    missingFields: REQUIRED_PROFILE_FIELDS.filter((f) => !staff[f] && staff[f] !== 0),
    missingDocuments: requiredDocs.filter((k) => !uploaded.has(k)),
  }
}

export function serializeStaff(staff) {
  const { passwordHash, documents, workLogs, payouts, ...rest } = staff
  return rest
}

export function serializeWorkLog(log) {
  return { ...log, date: log.date.toISOString().slice(0, 10) }
}

export function serializePayout(payout) {
  return { ...payout, paidOn: payout.paidOn.toISOString().slice(0, 10) }
}

export function generateTempPassword(length = 10) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const bytes = crypto.randomBytes(length)
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

export const PASSWORD_MIN_LENGTH = 8

export function monthRange(month) {
  const [y, m] = month.split('-').map(Number)
  return { gte: new Date(Date.UTC(y, m - 1, 1)), lt: new Date(Date.UTC(y, m, 1)) }
}

export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
