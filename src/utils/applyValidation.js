import { getPath } from './objectPath.js'
import { getAllRequiredDocuments } from './documentChecklist.js'

function filled(v) {
  return v !== undefined && v !== null && String(v).trim() !== ''
}

function isStep1Valid(data) {
  const basicOk = ['fullName', 'dob', 'gender', 'mobile', 'email', 'district', 'examCategory'].every((k) => filled(data[k]))
  const addressOk = ['doorNo', 'street', 'place', 'pincode'].every((k) => filled(data.address?.[k]))
  return basicOk && addressOk
}

function isStep2Valid(data) {
  if (!filled(data.parentStatus)) return false
  if (!filled(data.bothParentsDeceased)) return false

  if (data.bothParentsDeceased !== 'yes') {
    if (!filled(data.singleParent)) return false
    if (data.singleParent === 'yes' && !filled(data.supportingParent)) return false
  }

  if (!filled(data.annualIncome)) return false
  if (!filled(data.expenseBearer)) return false
  if (!filled(data.selfEarning)) return false

  if (data.selfEarning === 'yes') {
    if (!filled(data.employmentType) || !filled(data.monthlyIncome)) return false
  }

  if (!filled(data.socialCategory)) return false

  return true
}

function isStep3Valid(data) {
  const { tenth, twelfth, college } = data

  const tenthOk = filled(tenth.schoolName) && filled(tenth.percentage) && filled(tenth.schoolType)
  if (!tenthOk) return false

  if (!filled(data.hasDiploma)) return false
  if (data.hasDiploma === 'no') {
    const twelfthOk = filled(twelfth.schoolName) && filled(twelfth.percentage) && filled(twelfth.schoolType)
    if (!twelfthOk) return false
  }
  if (data.hasDiploma === 'yes') {
    if (!filled(data.diplomaPercentage)) return false
    if (!filled(data.latestAcademicPercentage)) return false
  }

  if (!filled(college.currentlyStudying)) return false
  if (college.currentlyStudying === 'yes' && !filled(college.year)) return false

  const collegeOk =
    filled(college.name) && filled(college.rollNumber) && filled(college.type) &&
    filled(college.address) && filled(college.degree) &&
    filled(college.academicYear) && filled(college.cgpa)
  if (!collegeOk) return false

  if (!filled(data.existingScholarship)) return false
  if (data.existingScholarship === 'yes') {
    if (!filled(data.scholarshipName) || !filled(data.scholarshipProvider)) return false
  }

  if (!filled(data.tamilMediumTill12)) return false

  return true
}

function isDeclarationValid(data) {
  return Boolean(data.declarationAccepted)
}

function isDocumentsValid(data) {
  return getAllRequiredDocuments(data)
    .filter((doc) => doc.required !== false)
    .every((doc) => Boolean(getPath(data, doc.key)))
}

const VALIDATORS = {
  1: isStep1Valid,
  2: isStep2Valid,
  3: isStep3Valid,
  // 4 (Summary) has no gating fields of its own.
  5: isDeclarationValid,
  6: isDocumentsValid,
}

export function isStepValid(step, data) {
  const validator = VALIDATORS[step]
  return validator ? validator(data) : true
}
