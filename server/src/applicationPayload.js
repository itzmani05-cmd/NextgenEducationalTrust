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

const JSON_FIELDS = ['tenth', 'twelfth', 'college']

export const FILE_FIELDS = [
  'fatherDeathCert', 'motherDeathCert', 'supportingDocument', 'incomeCertificate',
  'selfIncomeDoc', 'communityCertificate', 'scholarshipDoc',
  'diplomaMarkSheet', 'tamilMediumEvidence', 'studentPhoto', 'identityDocument',
  'educationalCertificates',
]

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
