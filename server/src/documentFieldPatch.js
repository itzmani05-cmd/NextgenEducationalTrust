import { FILE_FIELDS } from './applicationPayload.js'

const NESTED_DOC_KEYS = [
  'tenth.markSheet', 'twelfth.markSheet', 'college.markSheet', 'college.bonafide',
]

export const ALL_DOCUMENT_KEYS = [...FILE_FIELDS, ...NESTED_DOC_KEYS]

// Display order + human labels for every document key — the single source of
// truth shared by the application PDF (doc list + embedded attachments) and
// anywhere else that needs to show a document by name instead of its raw key.
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

// Builds the Prisma `data` patch that writes a storage path into the right
// place for a given document key — a flat `${key}Url` column for top-level
// documents, or a merge into the relevant nested Json blob (tenth/twelfth/college).
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

// { [docKey]: true | false } — whether each possible document has been uploaded.
// Used for the public status page, which should never see raw storage paths.
export function getDocumentPresenceMap(application) {
  const map = {}
  for (const key of ALL_DOCUMENT_KEYS) {
    map[key] = Boolean(getDocumentPath(application, key))
  }
  return map
}
