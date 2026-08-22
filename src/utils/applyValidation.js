import { getPath } from './objectPath.js'
import { getAllRequiredDocuments } from './documentChecklist.js'

function filled(v) {
  return v !== undefined && v !== null && String(v).trim() !== ''
}

function isStep1Valid(data) {
  const basicOk = ['fullName', 'dob', 'gender', 'mobile', 'email', 'district'].every((k) => filled(data[k]))
  const addressOk = ['doorNo', 'street', 'place', 'pincode'].every((k) => filled(data.address?.[k]))
  return basicOk && addressOk
}

function isStep2Valid(data) {
  if (!filled(data.parentStatus)) return false
  if (!filled(data.bothParentsDeceased)) return false

  if (data.bothParentsDeceased === 'yes') {
    if (!data.fatherDeathCert || !data.motherDeathCert) return false
  } else {
    if (!filled(data.singleParent)) return false
    if (data.singleParent === 'yes') {
      if (!filled(data.supportingParent) || !data.supportingDocument) return false
    }
  }

  if (!filled(data.annualIncome) || !data.incomeCertificate) return false
  if (!filled(data.expenseBearer)) return false
  if (!filled(data.selfEarning)) return false

  if (data.selfEarning === 'yes') {
    if (!filled(data.employmentType) || !filled(data.monthlyIncome)) return false
  }

  if (!filled(data.socialCategory)) return false
  const isScSt = ['SC', 'ST', 'SC(A)'].includes(data.socialCategory)
  if (isScSt && !data.communityCertificate) return false

  return true
}

function isStep3Valid(data) {
  const { tenth, twelfth, college } = data

  const tenthOk = filled(tenth.schoolName) && filled(tenth.percentage) && filled(tenth.schoolType) && tenth.markSheet
  const twelfthOk = filled(twelfth.schoolName) && filled(twelfth.percentage) && filled(twelfth.schoolType) && twelfth.markSheet
  if (!tenthOk || !twelfthOk) return false

  const collegeOk =
    filled(college.name) && filled(college.rollNumber) && filled(college.type) &&
    filled(college.address) && filled(college.degree) && filled(college.year) &&
    filled(college.academicYear) && filled(college.cgpa) && filled(college.latestPercentage) &&
    college.markSheet
  if (!collegeOk) return false

  if (!filled(data.existingScholarship)) return false
  if (data.existingScholarship === 'yes') {
    if (!filled(data.scholarshipName) || !filled(data.scholarshipProvider) || !data.scholarshipDoc) return false
  }

  if (!filled(data.hasDiploma)) return false
  if (data.hasDiploma === 'yes') {
    if (!filled(data.diplomaPercentage) || !data.diplomaMarkSheet) return false
    if (!filled(data.latestAcademicPercentage)) return false
  }

  if (!filled(data.medium)) return false
  if (!filled(data.tamilMediumTill12)) return false
  if (data.tamilMediumTill12 === 'yes' && !data.tamilMediumEvidence) return false

  return true
}

function isStep4Valid(data) {
  return getAllRequiredDocuments(data).every((doc) => Boolean(getPath(data, doc.key)))
}

const VALIDATORS = {
  1: isStep1Valid,
  2: isStep2Valid,
  3: isStep3Valid,
  4: isStep4Valid,
  // 5 (Summary) and 6 (Declaration) have no gating fields of their own.
}

export function isStepValid(step, data) {
  const validator = VALIDATORS[step]
  return validator ? validator(data) : true
}
