import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import { drawWatermark } from './receipt.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'Logo.png')
const WATERMARK_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'C3Logo.png')

function inr(n) {
  return n != null ? `Rs. ${Number(n).toLocaleString('en-IN')}` : '—'
}

function val(v) {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return String(v)
}

const INCOME_TIER_LABELS = {
  upto_1_5: `Up to ${inr(150000)}`,
  '1_5_to_3': `${inr(150000)} to ${inr(300000)}`,
  '3_to_5': `${inr(300000)} to ${inr(500000)}`,
  above_5: `Above ${inr(500000)}`,
}

function incomeLabel(code) {
  return INCOME_TIER_LABELS[code] || val(code)
}

function date(d, opts) {
  return d ? new Date(d).toLocaleDateString('en-IN', opts || { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

function section(doc, title, { align = 'left' } = {}) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - 60) doc.addPage()
  doc.moveDown(0.9)
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  doc.fontSize(12).fillColor('#1B2A4A').font('Helvetica-Bold')
    .text(title, doc.page.margins.left, doc.y, { width: contentWidth, align })
  const lineY = doc.y + 2
  doc.moveTo(doc.page.margins.left, lineY).lineTo(doc.page.width - doc.page.margins.right, lineY).strokeColor('#DDDDDD').lineWidth(0.5).stroke()
  doc.moveDown(0.5)
}

function row(doc, label, value) {
  const labelWidth = 170
  const x = doc.page.margins.left

  doc.fontSize(9.5)
  if (doc.y > doc.page.height - doc.page.margins.bottom - 20) doc.addPage()

  const y = doc.y
  doc.fillColor('#666666').font('Helvetica').text(label, x, y, { width: labelWidth })
  doc.fontSize(9.5).fillColor('#1A1A1A').font('Helvetica-Bold').text(val(value), x + labelWidth, y, {
    width: doc.page.width - doc.page.margins.right - (x + labelWidth),
  })
  doc.moveDown(0.35)
}

export function renderApplicationPdf(app) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    doc.on('pageAdded', () => drawWatermark(doc, WATERMARK_PATH))
    drawWatermark(doc, WATERMARK_PATH)

    const refNumber = `NGC-${app.id.slice(0, 8).toUpperCase()}`
    const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
    const logoWidth = 44

    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, doc.page.margins.left + (contentWidth - logoWidth) / 2, doc.y, { width: logoWidth })
        doc.y += logoWidth + 8
      } catch {
      }
    }

    doc.fontSize(14).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('NEXTGEN SOLUTIONS EDUCATIONAL TRUST', doc.page.margins.left, doc.y, { width: contentWidth, align: 'center' })
    doc.fontSize(8.5).fillColor('#666666').font('Helvetica')
      .text('4/1023-D, Ayyalu Meenakshi Nagar, Udumalpet - 642 126, Tiruppur (Dt.), Tamil Nadu', doc.page.margins.left, doc.y, { width: contentWidth, align: 'center' })
    doc.text('nextgencollegesolutions@gmail.com  |  93423 79043 / 97902 13628', doc.page.margins.left, doc.y, { width: contentWidth, align: 'center' })
    doc.moveDown(0.6)
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#DDDDDD').lineWidth(0.5).stroke()
    doc.moveDown(0.8)

    doc.fontSize(18).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('Scholarship Application Record', doc.page.margins.left, doc.y, { width: contentWidth, align: 'center' })
    doc.fontSize(9.5).fillColor('#666666').font('Helvetica')
      .text(`Reference ${refNumber}  ·  Generated ${date(new Date())}`, doc.page.margins.left, doc.y, { width: contentWidth, align: 'center' })

    section(doc, 'Student Details')
    row(doc, 'Full Name', app.fullName)
    row(doc, 'Date of Birth', app.dob)
    row(doc, 'Gender', app.gender)
    row(doc, 'Mobile', app.mobile)
    row(doc, 'Email', app.email)
    row(doc, 'Address', app.address)
    row(doc, 'District', app.district)

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
    row(doc, 'Annual Income', incomeLabel(app.annualIncome))
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

    if (app.payment) {
      section(doc, 'Payment')
      row(doc, 'Status', app.payment.status)
      row(doc, 'Original Fee', app.courseFee != null ? inr(app.courseFee) : null)
      row(doc, 'Concession Discount', app.finalApprovedConcession != null ? `${app.finalApprovedConcession}%` : null)
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
