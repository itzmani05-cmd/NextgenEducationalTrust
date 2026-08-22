import { FILE_FIELDS } from './applicationPayload.js'

const NESTED_DOC_KEYS = [
  'tenth.markSheet', 'twelfth.markSheet', 'college.markSheet', 'college.bonafide',
]

export const ALL_DOCUMENT_KEYS = [...FILE_FIELDS, ...NESTED_DOC_KEYS]

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
