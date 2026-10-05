export const STAFF_DOCUMENT_KINDS = [
  { key: 'photo', label: 'Passport Photo', hint: 'Recent photo, plain background', required: true, imageOnly: true },
  { key: 'id_proof', label: 'ID Proof (Aadhaar)', hint: 'Front and back in one file if possible', required: true },
  { key: 'pan_card', label: 'PAN Card', required: true },
  { key: 'degree_certificate', label: 'Degree Certificate', hint: 'Your highest qualification', required: true },
  { key: 'resume', label: 'Resume / CV', required: true },
  { key: 'bank_proof', label: 'Bank Passbook / Cancelled Cheque', hint: 'Showing account number and IFSC', required: true },
  { key: 'other_certificate', label: 'Other Certificates', hint: 'Mark sheets, B.Ed, experience letters, etc.', required: false, multiple: true },
]

export const documentLabel = (kind) => STAFF_DOCUMENT_KINDS.find((k) => k.key === kind)?.label || kind

export const QUALIFICATIONS = ['Diploma', 'Undergraduate (UG)', 'Postgraduate (PG)', 'M.Phil', 'Ph.D', 'Other']
export const GENDERS = ['Male', 'Female', 'Other']

export const STAFF_DOCUMENT_MAX_BYTES = 2 * 1024 * 1024

export const WORK_LOG_STATUS = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  approved: { label: 'Approved', className: 'bg-green-50 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-brand-red' },
}

export function formatMinutes(minutes) {
  const m = Number(minutes) || 0
  const h = Math.floor(m / 60)
  const rest = m % 60
  if (!h) return `${rest}m`
  return rest ? `${h}h ${rest}m` : `${h}h`
}

export function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function recentMonths(count = 12) {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return { value, label: monthLabel(value) }
  })
}

export async function shrinkImage(file, { maxSide = 1800, quality = 0.85, threshold = 900 * 1024 } = {}) {
  if (!file.type.startsWith('image/') || file.size <= threshold) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export function shortDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}
