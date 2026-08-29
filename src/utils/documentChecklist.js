import { getPath } from './objectPath.js'

export const STUDENT_PHOTO_MIME_TYPES = ['image/jpeg', 'image/png']

export const BASIC_DOCUMENTS = [
  { key: 'studentPhoto', labelKey: 'step5.studentPhoto', accept: STUDENT_PHOTO_MIME_TYPES },
  { key: 'identityDocument', labelKey: 'step5.identityDocument' },
  { key: 'tenth.markSheet', labelKey: 'step5.tenthMarkSheet' },
  { key: 'college.markSheet', labelKey: 'step5.latestCollegeMarkSheet' },
]

export function getConditionalDocuments(data) {
  const isScSt = data.socialCategory === 'SC/ST'

  return [
    data.bothParentsDeceased === 'yes' && { key: 'fatherDeathCert', labelKey: 'step5.fatherDeathCert' },
    data.bothParentsDeceased === 'yes' && { key: 'motherDeathCert', labelKey: 'step5.motherDeathCert' },
    data.singleParent === 'yes' && { key: 'supportingDocument', labelKey: 'step5.singleParentProof' },
    { key: 'incomeCertificate', labelKey: 'step5.incomeCertificate' },
    data.hasDiploma === 'no' && { key: 'twelfth.markSheet', labelKey: 'step5.twelfthMarkSheet' },
    data.hasDiploma === 'yes' && { key: 'diplomaMarkSheet', labelKey: 'step5.diplomaMarkSheet' },
    data.tamilMediumTill12 === 'yes' && { key: 'tamilMediumEvidence', labelKey: 'step5.tamilEvidence' },
    isScSt && { key: 'communityCertificate', labelKey: 'step5.scCert' },
    data.selfEarning === 'yes' && { key: 'selfIncomeDoc', labelKey: 'step5.selfSupportEvidence' },
    data.existingScholarship === 'yes' && { key: 'scholarshipDoc', labelKey: 'step5.scholarshipProof', required: false },
  ].filter(Boolean)
}

export function getAllRequiredDocuments(data) {
  return [...BASIC_DOCUMENTS, ...getConditionalDocuments(data)]
}

// Mirrors the server's storage layout (documentFieldPatch.js): flat documents
// are stored under `${key}Url`, nested ones (tenth/twelfth/college) directly
// under their own key. Use this — not the raw checklist key — to read a
// document's value off a fetched application record.
export function getDocumentFieldPath(docKey) {
  return docKey.includes('.') ? docKey : `${docKey}Url`
}

// { [docKey]: true | false } — whether each applicable document is already
// present on a fetched application record (server field names, via
// getDocumentFieldPath) — used to resume the Documents step after a refresh
// without losing track of what's already been uploaded.
export function getDocumentPresenceMap(app) {
  const map = {}
  for (const doc of getAllRequiredDocuments(app)) {
    map[doc.key] = Boolean(getPath(app, getDocumentFieldPath(doc.key)))
  }
  return map
}

export function areAllRequiredDocumentsUploaded(app) {
  return getAllRequiredDocuments(app)
    .filter((doc) => doc.required !== false)
    .every((doc) => Boolean(getPath(app, getDocumentFieldPath(doc.key))))
}
