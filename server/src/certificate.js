import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import { prisma } from './prismaClient.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from './supabaseAdmin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Reuses the same logo asset the frontend uses — this is a monorepo, so both
// sides can read it directly rather than duplicating the image.
const LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'FullLogo.png')

function inr(n) {
  return n != null ? `Rs. ${Number(n).toLocaleString('en-IN')}` : '—'
}

function renderCertificatePdf({
  certificateNumber, studentName, courseName, concessionPercentage,
  applicationRefNumber, courseFee, payableAmount, amountPaid, issuedAt,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).strokeColor('#1B2A4A').stroke()
    doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(0.5).strokeColor('#B3261E').stroke()

    let logoDrawn = false
    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, doc.page.width / 2 - 35, 50, { width: 70 })
        logoDrawn = true
      } catch {
        // Logo is a nice-to-have — never let a bad image file block issuance.
      }
    }

    doc.y = logoDrawn ? 130 : 60
    doc.fontSize(20).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('NextGen Education Trust', { align: 'center' })
    doc.moveDown(0.2)
    doc.fontSize(9).fillColor('#666').font('Helvetica')
      .text('nextgencollegesolutions@gmail.com  |  +91 93423 79043', { align: 'center' })

    doc.moveDown(1.2)
    doc.fontSize(16).fillColor('#B3261E').font('Helvetica-Bold')
      .text('Scholarship Concession Certificate', { align: 'center' })
    doc.moveDown(0.2)
    doc.fontSize(10).fillColor('#666').font('Helvetica')
      .text(`Certificate No: ${certificateNumber}`, { align: 'center' })

    doc.moveDown(1.5)
    doc.fontSize(11).fillColor('#222').font('Helvetica')
      .text('This is to certify that', { align: 'center' })
    doc.moveDown(0.4)
    doc.fontSize(18).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text(studentName, { align: 'center' })
    doc.moveDown(0.4)
    doc.fontSize(11).fillColor('#222').font('Helvetica').text(
      `(Application Reference: ${applicationRefNumber}) has been granted a scholarship fee concession of ` +
      `${concessionPercentage}% for ${courseName || 'the applied course'} by NextGen Education Trust, and that ` +
      'payment of the resulting payable amount has been verified.',
      { align: 'center' },
    )

    doc.moveDown(1.8)
    const rows = [
      ['Original Course Fee', inr(courseFee)],
      ['Approved Concession', `${concessionPercentage}%`],
      ['Amount Payable', inr(payableAmount)],
      ['Amount Paid', inr(amountPaid)],
      ['Date of Issue', new Date(issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
    ]
    const labelX = 150
    let y = doc.y
    for (const [label, value] of rows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, labelX, y)
      doc.fontSize(10).fillColor('#222').font('Helvetica').text(value, labelX + 160, y)
      y += 20
    }

    doc.y = y + 50
    doc.fontSize(10).fillColor('#222').font('Helvetica')
    doc.text('_______________________', 350, doc.y)
    doc.text('Authorized Signatory', 350, doc.y + 16)
    doc.text('NextGen Education Trust', 350, doc.y + 32)

    doc.fontSize(7.5).fillColor('#999').font('Helvetica').text(
      'This certificate confirms the concession and payment recorded in the NextGen Education Trust scholarship ' +
      'portal. It does not constitute government accreditation or approval.',
      50, doc.page.height - 85, { width: doc.page.width - 100, align: 'center' },
    )

    doc.end()
  })
}

function certPrefix(examCategory) {
  const cleaned = String(examCategory || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  return cleaned.slice(0, 10) || 'GEN'
}

// Idempotent: if a certificate already exists for this application, returns
// it unchanged rather than generating a duplicate. Only ever call this once
// PAYMENT_STATUS = approved has been confirmed by the caller — this function
// does not itself re-check that gate.
export async function issueCertificateForApplication(application, payment, adminEmail) {
  const existing = await prisma.certificate.findUnique({ where: { applicationId: application.id } })
  if (existing) return existing

  const year = new Date().getFullYear()
  const prefix = certPrefix(application.examCategory)
  const applicationRefNumber = `NGC-${application.id.slice(0, 8).toUpperCase()}`
  const courseName = application.college?.degree || application.examName || null

  let lastErr
  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await prisma.certificate.count()
    const certificateNumber = `NT/${prefix}/${year}/${String(count + 1 + attempt).padStart(5, '0')}`

    try {
      const pdfBuffer = await renderCertificatePdf({
        certificateNumber,
        studentName: application.fullName,
        courseName,
        concessionPercentage: application.finalApprovedConcession,
        applicationRefNumber,
        courseFee: application.courseFee,
        payableAmount: payment.amountDue,
        amountPaid: payment.amountPaid,
        issuedAt: new Date(),
      })

      const storagePath = `certificates/${application.id}/certificate-${Date.now()}.pdf`
      const supabase = getSupabaseAdmin()
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true })
      if (uploadError) throw uploadError

      return await prisma.certificate.create({
        data: {
          applicationId: application.id,
          certificateNumber,
          studentName: application.fullName,
          courseName,
          concessionPercentage: application.finalApprovedConcession,
          certificatePath: storagePath,
          issuedByEmail: adminEmail || null,
        },
      })
    } catch (err) {
      if (err.code === 'P2002') {
        lastErr = err
        continue // certificateNumber collision (concurrent issuance) — retry with a bumped sequence
      }
      throw err
    }
  }
  throw lastErr || new Error('Failed to generate a unique certificate number.')
}
