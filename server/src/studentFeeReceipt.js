import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import { prisma } from './prismaClient.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from './supabaseAdmin.js'
import { amountInWords, drawWatermark, drawSignature, drawSeal } from './receipt.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'Logo.png')
// Fee receipt uses the C3 (Skill Development Program) logo as its watermark
// instead of the Trust's general logo — the donation receipt is unaffected.
const WATERMARK_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'C3Logo.png')

function inr(n) {
  return n != null ? `Rs. ${Number(n).toLocaleString('en-IN')}` : '—'
}

function renderFeeReceiptPdf({ receiptNumber, application, payment, issuedAt }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    drawWatermark(doc, WATERMARK_PATH)

    let logoDrawn = false
    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, doc.page.width / 2 - 35, 75, { width: 70 })
        logoDrawn = true
      } catch {}
    }

    doc.y = logoDrawn ? 155 : 85
    doc.fontSize(18).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('NEXTGEN SOLUTIONS EDUCATIONAL TRUST', { align: 'center' })
    doc.moveDown(0.2)
    doc.fontSize(9).fillColor('#666').font('Helvetica')
      .text('4/1023-D, Ayyalu Meenakshi Nagar, Udumalpet - 642 126, Tiruppur (Dt.), Tamil Nadu', { align: 'center' })
    doc.text('nextgencollegesolutions@gmail.com  |  93423 79043 / 97902 13628', { align: 'center' })

    doc.moveDown(1)
    doc.moveTo(doc.page.width / 2 - 90, doc.y).lineTo(doc.page.width / 2 + 90, doc.y).lineWidth(1).strokeColor('#1B2A4A').stroke()
    doc.moveDown(0.8)
    doc.fontSize(15).fillColor('#B3261E').font('Helvetica-Bold').text('RECEIPT', { align: 'center' })

    doc.moveDown(1)
    const topY = doc.y
    doc.fontSize(10).fillColor('#222').font('Helvetica-Bold').text('Receipt No:', 50, topY)
    doc.font('Helvetica').text(receiptNumber, 130, topY)
    doc.font('Helvetica-Bold').text('Date:', 350, topY)
    doc.font('Helvetica').text(issuedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 390, topY)

    const appNumberY = topY + 20
    const applicationRefNumber = `NGC-${application.id.slice(0, 8).toUpperCase()}`
    doc.fontSize(10).fillColor('#222').font('Helvetica-Bold').text('Application No:', 50, appNumberY)
    doc.font('Helvetica').text(applicationRefNumber, 130, appNumberY)
    doc.y = appNumberY + 20

    doc.moveDown(0.6)
    // examName is stored English-only today, but older applications may still
    // hold the wizard's legacy "English / Tamil" display string — keep only
    // the English half so it never leaks onto an official document.
    const rawCourseName = application.examName || application.college?.degree || '—'
    const cleanCourseName = rawCourseName.split(' / ')[0].trim()
    const courseName = cleanCourseName === '—' ? cleanCourseName : `Skill Development Program - ${cleanCourseName}`
    const rows = [
      ['Received from', String(application.fullName || '').toUpperCase()],
      ['Course', courseName],
      ['Mobile', application.mobile],
      ['Email', application.email],
    ]
    let y = doc.y
    for (const [label, value] of rows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, 50, y)
      doc.fontSize(10).fillColor('#222').font('Helvetica').text(value || '—', 220, y, { width: 320 })
      y += 20
    }

    const sumY = y + 6
    doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text('A sum of Rupees:', 50, sumY)
    doc.fontSize(10).fillColor('#222').font('Helvetica').text(`${amountInWords(payment.amountPaid)} Only`, 220, sumY, { width: 320 })
    doc.y = sumY + 20

    doc.moveDown(1)
    doc.fontSize(11).fillColor('#1B2A4A').font('Helvetica-Bold').text('Fee Breakdown', 50, doc.y)
    doc.moveDown(0.4)
    const discountAmount = application.courseFee != null && payment.amountDue != null
      ? application.courseFee - payment.amountDue
      : null
    const feeRows = [
      ['Course Fee', inr(application.courseFee)],
      ['Concession', application.finalApprovedConcession != null ? `${application.finalApprovedConcession}%` : '—'],
      ['Discount Amount', inr(discountAmount)],
      ['Amount Payable', inr(payment.amountDue)],
    ]
    y = doc.y
    for (const [label, value] of feeRows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, 50, y)
      doc.fontSize(10).fillColor('#222').font('Helvetica').text(value, 220, y, { width: 320 })
      y += 18
    }

    doc.y = y + 4
    doc.rect(50, doc.y, doc.page.width - 100, 30).lineWidth(1).strokeColor('#1B2A4A').stroke()
    doc.fontSize(13).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text(`Amount Paid: Rs. ${Number(payment.amountPaid).toLocaleString('en-IN')} /-`, 60, doc.y + 8)

    doc.moveDown(1.8)
    doc.fontSize(11).fillColor('#1B2A4A').font('Helvetica-Bold').text('Payment Details', 50, doc.y)
    doc.moveDown(0.4)
    const payRows = [
      ['Payment Mode', payment.paymentMethod ? payment.paymentMethod.replace(/_/g, ' ').toUpperCase() : '—'],
      ['Payment Date', payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'],
      ['UTR / Transaction ID', payment.transactionId || '—'],
    ]
    y = doc.y
    for (const [label, value] of payRows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, 50, y)
      doc.fontSize(10).fillColor('#222').font('Helvetica').text(value, 220, y, { width: 320 })
      y += 18
    }

    doc.y = y + 14
    doc.fontSize(8.5).fillColor('#666').font('Helvetica').text(
      'This fee is collected for educational purpose only. Not refundable.',
      50, doc.y, { width: doc.page.width - 100 },
    )

    doc.y = Math.min(Math.max(doc.y + 40, doc.page.height - 160), doc.page.height - 100)
    const sigX = 290
    const sigWidth = doc.page.width - doc.page.margins.right - sigX
    // Captured once: doc.text() below moves doc.y as a side effect, so reading
    // doc.y again for the second line would stack its +32 on top of that
    // shift instead of the intended fixed offset from the signature block.
    const sigY = doc.y
    drawSeal(doc, 50, sigY)
    // Conventional order top-to-bottom: "For, <Trust>" line, then the
    // signature sitting in the gap above the designation, then "Managing
    // Trustee / Authorized Signatory" — not the signature floating above
    // the "For, ..." line.
   doc.fontSize(9.5).fillColor('#222').font('Helvetica')

    doc.text('For,', sigX, sigY, {
      continued: true
    })

    doc.fillColor('#B3261E')
      .text(' NEXTGEN SOLUTIONS EDUCATIONAL TRUST', {
        continued: false
      })

    drawSignature(doc, sigX, sigY + 55)

    doc.fillColor('#222')
      .text(
        'Managing Trustee / Authorized Signatory',
        sigX,
        sigY + 50,
        { width: sigWidth, lineBreak: false }
      )

    doc.fontSize(7.5).fillColor('#999').font('Helvetica').text(
      'This receipt confirms a fee payment recorded in the NEXTGEN SOLUTIONS EDUCATIONAL TRUST scholarship portal.',
      50, doc.page.height - 60, { width: doc.page.width - 100, align: 'center' },
    )

    doc.end()
  })
}

export { renderFeeReceiptPdf }

export async function issueFeeReceiptForPayment(application, payment) {
  const supabase = getSupabaseAdmin()

  if (payment.receiptNumber && payment.receiptPath) {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(payment.receiptPath)
    if (error) throw error
    return { payment, pdfBuffer: Buffer.from(await data.arrayBuffer()) }
  }

  const year = new Date().getFullYear()

  let lastErr
  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await prisma.payment.count({ where: { receiptNumber: { not: null } } })
    const receiptNumber = `NGF/${year}/${String(count + 1 + attempt).padStart(5, '0')}`

    try {
      const issuedAt = new Date()
      const pdfBuffer = await renderFeeReceiptPdf({ receiptNumber, application, payment, issuedAt })

      const storagePath = `payments/${application.id}/fee-receipt-${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true })
      if (uploadError) throw uploadError

      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: { receiptNumber, receiptPath: storagePath },
      })
      return { payment: updated, pdfBuffer }
    } catch (err) {
      if (err.code === 'P2002') {
        lastErr = err
        continue
      }
      throw err
    }
  }
  throw lastErr || new Error('Failed to generate a unique receipt number.')
}
