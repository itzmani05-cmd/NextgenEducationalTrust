import { Landmark, Building, Cpu, BookMarked } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

// Same exam options as the apply form (Step1Student). Listed here so every
// exam gets a card even before anyone has applied for it.
export const KNOWN_EXAMS = [
  { examCategory: 'state_govt', labelKey: 'step1.courseStateGovt', icon: Landmark, accent: 'text-brand-navy bg-blue-50' },
  { examCategory: 'central_govt', labelKey: 'step1.courseCentralGovt', icon: Building, accent: 'text-teal-700 bg-teal-50' },
  { examCategory: 'gate', labelKey: 'step1.courseGate', icon: Cpu, accent: 'text-purple-700 bg-purple-50' },
]

export function getExamMeta(examCategory, fallbackName) {
  const known = KNOWN_EXAMS.find((e) => e.examCategory === examCategory)
  if (known) return { ...known, label: enOnly(known.labelKey) }
  return {
    examCategory,
    label: fallbackName || enOnly('admin.analytics.examNotSpecified'),
    icon: BookMarked,
    accent: 'text-brand-muted bg-brand-surface',
  }
}

export const examKey = (app) => app.examCategory || 'unspecified'

// Rupee value of the concession the Trust approved for one student:
// course fee minus what they're asked to pay. Uses the same rounding as the
// server's amountDue, so this always matches the student's fee receipt.
// null until the Trust has set both the course fee and the concession %.
export function concessionAmount(app) {
  if (app.courseFee == null || app.finalApprovedConcession == null) return null
  if (app.status === 'rejected') return null
  const payable = Math.round(app.courseFee * (100 - app.finalApprovedConcession) / 100)
  return app.courseFee - payable
}

export function summarizeExams(applications) {
  const groups = new Map(
    KNOWN_EXAMS.map((e) => [e.examCategory, { ...getExamMeta(e.examCategory), students: 0, withConcession: 0, totalConcession: 0 }]),
  )
  for (const app of applications) {
    const key = examKey(app)
    if (!groups.has(key)) {
      groups.set(key, { ...getExamMeta(key, app.examName), students: 0, withConcession: 0, totalConcession: 0 })
    }
    const g = groups.get(key)
    g.students += 1
    const amount = concessionAmount(app)
    if (amount != null) {
      g.withConcession += 1
      g.totalConcession += amount
    }
  }
  return [...groups.values()]
}

export const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`
