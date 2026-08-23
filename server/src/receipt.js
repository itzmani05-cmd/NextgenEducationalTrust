import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import { prisma } from './prismaClient.js'
import { getSupabaseAdmin, STORAGE_BUCKET } from './supabaseAdmin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'TrustLogo.png')
const WATERMARK_LOGO_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'Logo.png')
const SIGNATURE_PATH = path.join(__dirname, '..', '..', 'src', 'assests', 'signature.png')

function drawWatermark(doc) {
  if (!fs.existsSync(WATERMARK_LOGO_PATH)) return
  try {
    const size = 320
    doc.save()
    doc.opacity(0.06)
    doc.image(WATERMARK_LOGO_PATH, doc.page.width / 2 - size / 2, doc.page.height / 2 - size / 2, { width: size })
    doc.opacity(1)
    doc.restore()
  } catch {}
}

function drawSignature(doc, x, y) {
  if (fs.existsSync(SIGNATURE_PATH)) {
    try {
      doc.image(SIGNATURE_PATH, x, y - 34, { width: 130 })
      return
    } catch {}
  }
  doc.fontSize(10).fillColor('#222').font('Helvetica').text('_______________________', x, y)
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigits(n) {
  if (n < 20) return ONES[n]
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`
}

function threeDigits(n) {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  return [hundreds ? `${ONES[hundreds]} Hundred` : '', rest ? twoDigits(rest) : ''].filter(Boolean).join(' ')
}

function amountInWords(n) {
  n = Math.round(n)
  if (n === 0) return 'Zero'

  const crore = Math.floor(n / 10000000); n %= 10000000
  const lakh = Math.floor(n / 100000); n %= 100000
  const thousand = Math.floor(n / 1000); n %= 1000
  const hundred = n

  const parts = []
  if (crore) parts.push(`${threeDigits(crore)} Crore`)
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`)
  if (hundred) parts.push(threeDigits(hundred))
  return parts.join(' ')
}

function renderReceiptPdf({ receiptNumber, donation, issuedAt }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    drawWatermark(doc)

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).strokeColor('#1B2A4A').stroke()
    doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(0.5).strokeColor('#B3261E').stroke()

    let logoDrawn = false
    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, doc.page.width / 2 - 35, 45, { width: 70 })
        logoDrawn = true
      } catch {}
    }

    doc.y = logoDrawn ? 125 : 55
    doc.fontSize(18).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text('NextGen Solutions Educational Trust', { align: 'center' })
    doc.moveDown(0.2)
    doc.fontSize(9).fillColor('#666').font('Helvetica')
      .text('4/1023-D, Ayyalu Meenakshi Nagar, Udumalpet - 642 126, Tiruppur (Dt.), Tamil Nadu', { align: 'center' })
    doc.text('nextgencollegesolutions@gmail.com  |  93423 79043 / 97902 13628', { align: 'center' })

    doc.moveDown(1)
    doc.fontSize(15).fillColor('#B3261E').font('Helvetica-Bold').text('DONATION RECEIPT', { align: 'center' })

    doc.moveDown(1)
    const topY = doc.y
    doc.fontSize(10).fillColor('#222').font('Helvetica-Bold').text('Receipt No:', 50, topY)
    doc.font('Helvetica').text(receiptNumber, 130, topY)
    doc.font('Helvetica-Bold').text('Date:', 350, topY)
    doc.font('Helvetica').text(issuedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 390, topY)

    doc.moveDown(1.4)
    const rows = [
      ['Received with thanks from', donation.fullName],
      ['Email', donation.email],
      ['Mobile', donation.mobile],
      ['PAN', donation.pan || 'Not provided'],
    ]
    let y = doc.y
    for (const [label, value] of rows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, 50, y)
      doc.fontSize(10).fillColor('#222').font('Helvetica').text(value, 220, y)
      y += 20
    }

    doc.y = y + 6
    doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text('A sum of Rupees:', 50, doc.y)
    doc.fontSize(10).fillColor('#222').font('Helvetica').text(`${amountInWords(donation.amount)} Only`, 220, doc.y, { width: 320 })

    doc.moveDown(1.6)
    doc.rect(50, doc.y, doc.page.width - 100, 34).lineWidth(1).strokeColor('#1B2A4A').stroke()
    doc.fontSize(14).fillColor('#1B2A4A').font('Helvetica-Bold')
      .text(`Amount: Rs. ${donation.amount.toLocaleString('en-IN')} /-`, 60, doc.y + 10)

    doc.moveDown(2.6)
    doc.fontSize(11).fillColor('#1B2A4A').font('Helvetica-Bold').text('Payment Details', 50, doc.y)
    doc.moveDown(0.5)
    const payRows = [
      ['Payment Mode', 'UPI'],
      ['Payment Date', new Date(donation.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
      ['UTR / Transaction ID', donation.transactionRef],
      ['Purpose', donation.purpose],
    ]
    y = doc.y
    for (const [label, value] of payRows) {
      doc.fontSize(10).fillColor('#555').font('Helvetica-Bold').text(`${label}:`, 50, y)
      doc.fontSize(10).fillColor('#222').font('Helvetica').text(value, 220, y, { width: 320 })
      y += 20
    }

    doc.y = y + 20
    doc.fontSize(8.5).fillColor('#666').font('Helvetica').text(
      'This donation is voluntary. Please retain this receipt for your records.',
      50, doc.y, { width: doc.page.width - 100 },
    )

    doc.y = Math.max(doc.y + 60, doc.page.height - 160)
    drawSignature(doc, 350, doc.y)
    doc.fontSize(10).fillColor('#222').font('Helvetica')
    doc.text('For, NextGen Solutions Educational Trust', 350, doc.y + 16, { width: 200 })
    doc.text('Authorized Signatory', 350, doc.y + 32)

    doc.fontSize(7.5).fillColor('#999').font('Helvetica').text(
      'This receipt confirms a donation recorded in the NextGen Solutions Educational Trust donation portal.',
      50, doc.page.height - 65, { width: doc.page.width - 100, align: 'center' },
    )

    doc.end()
  })
}

export async function issueReceiptForDonation(donation) {
  const supabase = getSupabaseAdmin()

  if (donation.receiptNumber && donation.receiptPath) {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(donation.receiptPath)
    if (error) throw error
    return { donation, pdfBuffer: Buffer.from(await data.arrayBuffer()) }
  }

  const year = new Date().getFullYear()

  let lastErr
  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await prisma.donation.count({ where: { receiptNumber: { not: null } } })
    const receiptNumber = `NGD/${year}/${String(count + 1 + attempt).padStart(5, '0')}`

    try {
      const issuedAt = new Date()
      const pdfBuffer = await renderReceiptPdf({ receiptNumber, donation, issuedAt })

      const storagePath = `donations/${donation.id}/receipt-${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true })
      if (uploadError) throw uploadError

      const updated = await prisma.donation.update({
        where: { id: donation.id },
        data: { receiptNumber, receiptPath: storagePath },
      })
      return { donation: updated, pdfBuffer }
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

export { renderReceiptPdf, amountInWords, drawWatermark, drawSignature }
