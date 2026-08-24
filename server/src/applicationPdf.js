import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import { DOCUMENT_LABELS } from './documentFieldPatch.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'Logo.png')

function inr(n) {
  return n != null ? `Rs. ${Number(n).toLocaleString('en-IN')}` : '—'
}

function val(v) {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return String(v)
}

function date(d, opts) {
  return d ? new Date(d).toLocaleDateString('en-IN', opts || { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

function section(doc, title) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - 60) doc.addPage()
  doc.moveDown(0.9)
  doc.fontSize(12).fillColor('#1B2A4A').font('Helvetica-Bold').text(title)
  const lineY = doc.y + 2
  doc.moveTo(doc.page.margins.left, lineY).lineTo(doc.page.width - doc.page.margins.right, lineY).strokeColor('#DDDDDD').lineWidth(0.5).stroke()
  doc.moveDown(0.5)
}

function row(doc, label, value) {
  const labelWidth = 170
  const x = doc.page.margins.left
  const y = doc.y
  doc.fontSize(9.5).fillColor('#666666').font('Helvetica').text(label, x, y, { width: labelWidth })
  doc.fontSize(9.5).fillColor('#1A1A1A').font('Helvetica-Bold').text(val(value), x + labelWidth, y, {
    width: doc.page.width - doc.page.margins.right - (x + labelWidth),
  })
  doc.moveDown(0.35)
}

function docKeyPresent(app, docKey) {
  if (docKey.includes('.')) {
    const [parent, child] = docKey.split('.')
    return Boolean(app[parent]?.[child])
  }
  return Boolean(app[`${docKey}Url`])
}

// Only ever lists documents the applicant actually uploaded — every uploaded
// one gets a full-page preview appended at the end of this document (images
// scaled to fill the page, uploaded PDFs merged in as-is; see
// appendDocumentAttachments in routes/applications.js), so this row is just
// a contents pointer, not a status flag.
function docRow(doc, label, present) {
  if (!present) return
  row(doc, label, 'Uploaded')
}

// Renders the entire application record as a PDF — every field the applicant
// submitted, plus current verification, concession, and payment status — for
// the Trust admin team to keep or hand off offline. Generated fresh on every
// request rather than stored, so it always reflects the latest admin
// decisions (concession overrides, payment approval, etc).
export function renderApplicationPdf(app) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const refNumber = `NGC-${app.id.slice(0, 8).toUpperCase()}`

    let logoDrawn = false
    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, doc.page.margins.left, doc.y, { width: 40 })
        logoDrawn = true
      } catch {
        // Logo is a nice-to-have — never let a bad image file block generation.
      }
    }

    const headerX = logoDrawn ? doc.page.margins.left + 52 : doc.page.margins.left
    const headerTop = doc.y
    doc.fontSize(14).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('NEXTGEN SOLUTIONS EDUCATIONAL TRUST', headerX, headerTop, { width: doc.page.width - doc.page.margins.right - headerX })
    doc.fontSize(8.5).fillColor('#666666').font('Helvetica')
      .text('4/1023-D, Ayyalu Meenakshi Nagar, Udumalpet - 642 126, Tiruppur (Dt.), Tamil Nadu', headerX)
    doc.text('nextgencollegesolutions@gmail.com  |  93423 79043 / 97902 13628', headerX)
    doc.y = Math.max(doc.y, headerTop + 40) + 8
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#DDDDDD').lineWidth(0.5).stroke()
    doc.moveDown(0.8)

    doc.fontSize(18).fillColor('#1B2A4A').font('Helvetica-Bold').text('Scholarship Application Record')
    doc.fontSize(9.5).fillColor('#666666').font('Helvetica')
      .text(`Reference ${refNumber}  ·  Generated ${date(new Date())}`)
    doc.moveDown(0.3)
    doc.fontSize(9.5).fillColor('#666666').text(`Status: ${val(app.status)}`)

    section(doc, 'Student Details')
    row(doc, 'Full Name', app.fullName)
    row(doc, 'Date of Birth', app.dob)
    row(doc, 'Gender', app.gender)
    row(doc, 'Mobile', app.mobile)
    row(doc, 'Email', app.email)
    row(doc, 'Address', app.address)
    row(doc, 'District', app.district)

    if (app.payment?.receiptNumber) {
      section(doc, 'Fee Receipt')
      row(doc, 'Receipt No.', app.payment.receiptNumber)
      row(doc, 'Amount Paid', app.payment.amountPaid != null ? inr(app.payment.amountPaid) : null)
      row(doc, 'Payment Date', app.payment.paymentDate ? date(app.payment.paymentDate) : null)
      row(doc, 'Payment Mode', app.payment.paymentMethod ? app.payment.paymentMethod.replace(/_/g, ' ').toUpperCase() : null)
    }

    section(doc, 'Family')
    row(doc, "Father's Name", app.fatherName)
    row(doc, "Father's Occupation", app.fatherOccupation)
    row(doc, "Father's Contact", app.fatherContact)
    row(doc, "Mother's Name", app.motherName)
    row(doc, "Mother's Occupation", app.motherOccupation)
    row(doc, "Mother's Contact", app.motherContact)
    row(doc, "Guardian's Name", app.guardianName)
    row(doc, 'Guardian Relation', app.guardianRelation)
    row(doc, 'Guardian Contact', app.guardianContact)
    row(doc, 'Parent Status', app.parentStatus)
    row(doc, 'Both Parents Deceased', app.bothParentsDeceased)
    row(doc, 'Single Parent Supported', app.singleParent)
    row(doc, 'Supporting Parent', app.supportingParent)

    section(doc, 'Financial')
    row(doc, 'Annual Income', app.annualIncome)
    row(doc, 'Expense Bearer', app.expenseBearer)
    row(doc, 'Self Earning', app.selfEarning)
    row(doc, 'Employment Type', app.employmentType)
    row(doc, 'Monthly Income', app.monthlyIncome)

    section(doc, 'Social Category & Existing Scholarship')
    row(doc, 'Social Category', app.socialCategory)
    row(doc, 'Existing Scholarship', app.existingScholarship)
    row(doc, 'Scholarship Name', app.scholarshipName)
    row(doc, 'Scholarship Provider', app.scholarshipProvider)
    row(doc, 'Scholarship Amount', app.scholarshipAmount)
    row(doc, 'Scholarship Year', app.scholarshipYear)

    section(doc, '10th Standard')
    row(doc, 'School Name', app.tenth?.schoolName)
    row(doc, 'School Type', app.tenth?.schoolType)
    row(doc, 'Percentage', app.tenth?.percentage)

    section(doc, '12th Standard')
    row(doc, 'School Name', app.twelfth?.schoolName)
    row(doc, 'School Type', app.twelfth?.schoolType)
    row(doc, 'Percentage', app.twelfth?.percentage)

    section(doc, 'College / Institution')
    row(doc, 'Name', app.college?.name)
    row(doc, 'Type', app.college?.type)
    row(doc, 'Address', app.college?.address)
    row(doc, 'Roll Number', app.college?.rollNumber)
    row(doc, 'Degree', app.college?.degree)
    row(doc, 'Branch', app.college?.branch)
    row(doc, 'Currently Studying in College', app.college?.currentlyStudying)
    row(doc, 'Year', app.college?.year)
    row(doc, 'Semester', app.college?.semester)
    row(doc, 'Academic Year', app.college?.academicYear)
    row(doc, 'Expected Graduation', app.college?.gradYear)
    row(doc, 'CGPA / Percentage', app.college?.cgpa)

    section(doc, 'Academic Performance & Medium')
    row(doc, 'Diploma', app.hasDiploma)
    row(doc, 'Diploma Percentage', app.diplomaPercentage)
    row(doc, 'Latest Academic Percentage', app.latestAcademicPercentage)
    row(doc, 'PSTM (Studied in Tamil Medium)', app.tamilMediumTill12)

    section(doc, 'Documents')
    for (const [docKey, label] of DOCUMENT_LABELS) {
      docRow(doc, label, docKeyPresent(app, docKey))
    }

    section(doc, 'Concession Decision')
    row(doc, 'System-Calculated Concession', app.calculatedConcession != null ? `${app.calculatedConcession}%` : null)
    row(doc, 'Concession Category', app.concessionCategory)
    row(doc, 'Final Approved Concession', app.finalApprovedConcession != null ? `${app.finalApprovedConcession}%` : null)
    row(doc, 'Original Course Fee', app.courseFee != null ? inr(app.courseFee) : null)
    row(doc, 'Committee Notes', app.concessionNote)
    row(doc, 'Decided At', app.concessionDecidedAt ? date(app.concessionDecidedAt, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null)

    if (app.payment) {
      section(doc, 'Payment')
      row(doc, 'Status', app.payment.status)
      row(doc, 'Amount Due', app.payment.amountDue != null ? inr(app.payment.amountDue) : null)
      row(doc, 'Amount Paid', app.payment.amountPaid != null ? inr(app.payment.amountPaid) : null)
      row(doc, 'Transaction ID', app.payment.transactionId)
      row(doc, 'Payment Method', app.payment.paymentMethod)
      row(doc, 'Payment Date', app.payment.paymentDate ? date(app.payment.paymentDate) : null)
      row(doc, 'Submitted At', app.payment.submittedAt ? date(app.payment.submittedAt, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null)
      if (app.payment.status === 'rejected' && app.payment.rejectionReason) {
        row(doc, 'Rejection Reason', app.payment.rejectionReason)
      }
    }

    section(doc, 'Declaration')
    row(doc, 'Declaration Accepted', app.declarationAccepted)

    doc.end()
  })
}
