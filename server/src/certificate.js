import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import { prisma } from './prismaClient.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from './supabaseAdmin.js'
import { drawWatermark, drawSignature } from './receipt.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Reuses the same logo asset the frontend uses — this is a monorepo, so both
// sides can read it directly rather than duplicating the image.
const LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'FullLogo.png')

function inr(n) {
  return n != null ? `Rs. ${Number(n).toLocaleString('en-IN')}` : '—'
}

export function renderCertificatePdf({
  certificateNumber, studentName, courseName, concessionPercentage,
  applicationRefNumber, courseFee, payableAmount, amountPaid, issuedAt,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    // Layout is fully hand-positioned within the decorative border, so PDFKit's
    // margin-triggered auto-pagination would only ever misfire here — disable it.
    doc.page.margins.bottom = 0

    const M = 28
    doc.rect(M, M, doc.page.width - 2 * M, doc.page.height - 2 * M).lineWidth(2.5).strokeColor('#1B2A4A').stroke()
    doc.rect(M + 6, M + 6, doc.page.width - 2 * (M + 6), doc.page.height - 2 * (M + 6)).lineWidth(0.75).strokeColor('#B3261E').stroke()
    // Gold accent hairline just inside the red rule ties the two border colors together.
    doc.rect(M + 10, M + 10, doc.page.width - 2 * (M + 10), doc.page.height - 2 * (M + 10)).lineWidth(0.5).strokeColor('#D4AF37').stroke()

    drawWatermark(doc)

    let logoDrawn = false
    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, doc.page.width / 2 - 38, 56, { width: 76 })
        logoDrawn = true
      } catch {
        // Logo is a nice-to-have — never let a bad image file block issuance.
      }
    }

    doc.y = logoDrawn ? 142 : 66
    doc.fontSize(21).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('NextGen Education Trust', { align: 'center' })
    doc.moveDown(0.15)
    doc.fontSize(9).fillColor('#777').font('Helvetica')
      .text('nextgencollegesolutions@gmail.com  |  +91 93423 79043', { align: 'center' })

    doc.moveDown(0.9)
    doc.moveTo(doc.page.width / 2 - 110, doc.y).lineTo(doc.page.width / 2 + 110, doc.y).lineWidth(1).strokeColor('#D4AF37').stroke()

    doc.moveDown(0.9)
    doc.fontSize(19).fillColor('#B3261E').font('Helvetica-Bold')
      .text('SCHOLARSHIP CONCESSION CERTIFICATE', { align: 'center', characterSpacing: 0.6 })
    doc.moveDown(0.25)
    doc.fontSize(9.5).fillColor('#777').font('Helvetica')
      .text(`Certificate No: ${certificateNumber}`, { align: 'center' })

    doc.moveDown(1.6)
    doc.fontSize(11).fillColor('#444').font('Helvetica')
      .text('This is to certify that', { align: 'center' })
    doc.moveDown(0.35)
    doc.fontSize(22).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text(String(studentName || '').toUpperCase(), { align: 'center' })
    doc.moveDown(0.1)
    const nameY = doc.y
    doc.moveTo(doc.page.width / 2 - 130, nameY).lineTo(doc.page.width / 2 + 130, nameY).lineWidth(0.75).strokeColor('#D4AF37').stroke()
    doc.moveDown(0.5)
    doc.fontSize(11).fillColor('#333').font('Helvetica').text(
      `(Application Reference: ${applicationRefNumber}) has been granted a scholarship fee concession of ` +
      `${concessionPercentage}% for ${courseName || 'the applied course'} by NextGen Education Trust, and that ` +
      'payment of the resulting payable amount has been verified.',
      { align: 'center', width: doc.page.width - 2 * (M + 60), lineGap: 2 },
    )

    doc.moveDown(1.6)
    const rows = [
      ['Original Course Fee', inr(courseFee)],
      ['Approved Concession', `${concessionPercentage}%`],
      ['Amount Payable', inr(payableAmount)],
      ['Amount Paid', inr(amountPaid)],
      ['Date of Issue', new Date(issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
    ]
    const boxX = M + 60
    const boxWidth = doc.page.width - 2 * boxX
    const boxTop = doc.y
    const boxHeight = rows.length * 20 + 20
    doc.rect(boxX, boxTop, boxWidth, boxHeight).fillAndStroke('#F7F5F1', '#E3E9F2')
    const labelX = boxX + 30
    let y = boxTop + 12
    for (const [label, value] of rows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, labelX, y)
      doc.fontSize(10).fillColor('#1B2A4A').font('Helvetica-Bold').text(value, labelX + 170, y)
      y += 20
    }

    doc.y = boxTop + boxHeight + 46
    drawSignature(doc, doc.page.width - M - 60 - 130, doc.y)
    doc.moveTo(doc.page.width - M - 60 - 130, doc.y + 4).lineTo(doc.page.width - M - 60, doc.y + 4).lineWidth(0.5).strokeColor('#AAA').stroke()
    doc.fontSize(10).fillColor('#222').font('Helvetica-Bold')
    doc.text('Authorized Signatory', doc.page.width - M - 60 - 130, doc.y + 10, { width: 130, align: 'center' })
    doc.fontSize(9).fillColor('#666').font('Helvetica')
    doc.text('NextGen Education Trust', doc.page.width - M - 60 - 130, doc.y + 24, { width: 130, align: 'center' })

    doc.fontSize(7.5).fillColor('#999').font('Helvetica').text(
      'This certificate confirms the concession and payment recorded in the NextGen Education Trust scholarship ' +
      'portal. It does not constitute government accreditation or approval.',
      M + 20, doc.page.height - M - 34, { width: doc.page.width - 2 * (M + 20), align: 'center' },
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
