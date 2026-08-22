// Scalar fields sent by the frontend using the exact same name as the Prisma column.
const DIRECT_FIELDS = [
  'fullName', 'dob', 'gender', 'mobile', 'email', 'address', 'district',

  'fatherName', 'fatherOccupation', 'fatherContact',
  'motherName', 'motherOccupation', 'motherContact',
  'guardianName', 'guardianRelation', 'guardianContact', 'parentStatus',
  'bothParentsDeceased', 'singleParent', 'supportingParent',

  'annualIncome', 'expenseBearer', 'selfEarning', 'employmentType',
  'monthlyIncome',

  'socialCategory', 'existingScholarship', 'scholarshipName',
  'scholarshipProvider', 'scholarshipAmount', 'scholarshipYear',

  'hasDiploma', 'diplomaPercentage', 'latestAcademicPercentage',
  'medium', 'tamilMediumTill12',

  'examCategory', 'examName', 'examYear', 'targetAttempt',
  'relevantQualification', 'coachingMode',

  'declarationAccepted',
]

// Nested Json blobs, passed through as-is.
const JSON_FIELDS = ['tenth', 'twelfth', 'college']

// Frontend sends the raw File-holding field name (currently always null until
// Storage upload is wired up); Prisma stores the eventual URL under `${key}Url`.
export const FILE_FIELDS = [
  'fatherDeathCert', 'motherDeathCert', 'supportingDocument', 'incomeCertificate',
  'selfIncomeDoc', 'communityCertificate', 'scholarshipDoc', 'govtSchoolEvidence',
  'diplomaMarkSheet', 'tamilMediumEvidence', 'studentPhoto', 'identityDocument',
  'educationalCertificates',
]

// Builds a Prisma-safe `data` object from the raw wizard payload, dropping
// anything the schema doesn't recognize instead of letting Prisma throw.
export function mapApplicationPayload(body) {
  const data = {}

  for (const key of DIRECT_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  for (const key of JSON_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  for (const key of FILE_FIELDS) {
    if (body[key] !== undefined) data[`${key}Url`] = body[key] ?? null
  }

  return data
}
