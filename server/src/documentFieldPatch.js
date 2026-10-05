import { FILE_FIELDS } from './applicationPayload.js'

const NESTED_DOC_KEYS = [
  'tenth.markSheet', 'twelfth.markSheet', 'college.markSheet', 'college.bonafide',
]

export const ALL_DOCUMENT_KEYS = [...FILE_FIELDS, ...NESTED_DOC_KEYS]

export const DOCUMENT_LABELS = [
  ['studentPhoto', 'Student Photograph'],
  ['identityDocument', 'Identity Document'],
  ['tenth.markSheet', '10th Mark Sheet'],
  ['twelfth.markSheet', '12th Mark Sheet'],
  ['college.markSheet', 'Latest College Mark Sheet'],
  ['college.bonafide', 'College Bonafide Certificate'],
  ['fatherDeathCert', "Father's Death Certificate"],
  ['motherDeathCert', "Mother's Death Certificate"],
  ['supportingDocument', 'Single-Parent Proof'],
  ['incomeCertificate', 'Income Certificate'],
  ['diplomaMarkSheet', 'Diploma Mark Sheet'],
  ['tamilMediumEvidence', 'Tamil-Medium Evidence'],
  ['communityCertificate', 'SC/ST Community Certificate'],
  ['selfIncomeDoc', 'Financial Self-Support Evidence'],
  ['scholarshipDoc', 'Existing Scholarship Proof'],
  ['educationalCertificates', 'Educational Certificates'],
]

export function isKnownDocumentKey(docKey) {
  return ALL_DOCUMENT_KEYS.includes(docKey)
}

export function buildDocumentUrlPatch(existing, docKey, storagePath) {
  if (docKey.includes('.')) {
    const [parent, child] = docKey.split('.')
    return { [parent]: { ...(existing[parent] || {}), [child]: storagePath } }
  }
  return { [`${docKey}Url`]: storagePath }
}

export function getDocumentPath(application, docKey) {
  if (docKey.includes('.')) {
    const [parent, child] = docKey.split('.')
    return application[parent]?.[child] || null
  }
  return application[`${docKey}Url`] || null
}

export function getDocumentPresenceMap(application) {
  const map = {}
  for (const key of ALL_DOCUMENT_KEYS) {
    map[key] = Boolean(getDocumentPath(application, key))
  }
  return map
}
