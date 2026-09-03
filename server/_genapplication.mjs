import fs from 'fs'
import { renderApplicationPdf } from './src/applicationPdf.js'

const application = {
  id: 'a1b2c3d4-e5f6-4789-9abc-def012345678',
  status: 'approved',
  fullName: 'Priyanka Ramachandran',
  dob: '2005-04-12',
  gender: 'Female',
  mobile: '9876543210',
  email: 'priyanka@example.com',
  address: '12, Kamaraj Street, Udumalpet',
  district: 'Tiruppur',

  fatherName: 'Ramachandran S.',
  fatherOccupation: 'Farmer',
  fatherContact: '9876500001',
  motherName: 'Lakshmi R.',
  motherOccupation: 'Homemaker',
  motherContact: '9876500002',
  guardianName: '',
  guardianRelation: '',
  guardianContact: '',
  parentStatus: 'both_alive',
  bothParentsDeceased: 'no',
  singleParent: 'no',
  supportingParent: '',

  annualIncome: '1_5_to_3',
  expenseBearer: 'father',
  selfEarning: 'no',
  employmentType: '',
  monthlyIncome: '',

  socialCategory: 'BC',
  existingScholarship: 'no',
  scholarshipName: '',
  scholarshipProvider: '',
  scholarshipAmount: '',
  scholarshipYear: '',

  tenth: { schoolName: 'Government Higher Secondary School, Udumalpet', schoolType: 'Government', percentage: 78 },
  twelfth: { schoolName: 'Government Higher Secondary School, Udumalpet', schoolType: 'Government', percentage: 82 },

  college: {
    name: 'PSG College of Technology',
    type: 'Private',
    address: 'Peelamedu, Coimbatore',
    rollNumber: '21CS045',
    degree: 'B.E. Computer Science',
    branch: 'Computer Science and Engineering',
    currentlyStudying: 'yes',
    year: '3rd Year',
    semester: '5',
    academicYear: '2025-26',
    gradYear: '2027',
    cgpa: '8.4',
    markSheet: 'college-marksheet.pdf',
  },

  hasDiploma: 'no',
  diplomaPercentage: '',
  latestAcademicPercentage: '82',
  tamilMediumTill12: 'yes',

  studentPhotoUrl: 'student-photo.jpg',
  identityDocumentUrl: 'identity-document.pdf',
  incomeCertificateUrl: 'income-certificate.pdf',
  tamilMediumEvidenceUrl: 'tamil-medium-evidence.pdf',

  documentReviews: {
    studentPhoto: { status: 'approved' },
    identityDocument: { status: 'approved' },
    'tenth.markSheet': { status: 'approved' },
    'twelfth.markSheet': { status: 'approved' },
    'college.markSheet': { status: 'approved' },
    incomeCertificate: { status: 'approved' },
    tamilMediumEvidence: { status: 'approved' },
  },

  calculatedConcession: 43,
  concessionCategory: 'category3',
  finalApprovedConcession: 43,
  courseFee: 25000,
  concessionNote: 'Approved as per income-tier calculation; no committee override needed.',
  concessionDecidedAt: new Date('2026-08-18T11:30:00'),

  payment: {
    status: 'approved',
    amountDue: 14250,
    amountPaid: 14250,
    receiptNumber: 'NGF/2026/00001',
    transactionId: 'HDFC2026082098765',
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2026-08-20'),
    submittedAt: new Date('2026-08-20T09:15:00'),
  },

  declarationAccepted: true,
}

const buf = await renderApplicationPdf(application)
fs.writeFileSync('../docs/application-record.pdf', buf)
console.log('written', buf.length)
