import { formatExpenseDate, getPaymentModeLabel } from './expenseConstants.js'
import logoUrl from '../../../assests/Logo.png'
import watermarkUrl from '../../../assests/C3Logo.png'
import sealUrl from '../../../assests/seal.png'
import signatureUrl from '../../../assests/signature.png'

const TRUST_NAME = 'NEXTGEN SOLUTIONS EDUCATIONAL TRUST'
const TRUST_ADDRESS = '4/1023-D, Ayyalu Meenakshi Nagar, Udumalpet - 642 126, Tiruppur (Dt.), Tamil Nadu'
const TRUST_CONTACT = 'nextgencollegesolutions@gmail.com  |  93423 79043 / 97902 13628'

const categoryName = (categoriesById, id) => categoriesById[id]?.name || 'Uncategorised'

function fileName(base, ext) {
  return `${base}-${new Date().toISOString().slice(0, 10)}.${ext}`
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function csvCell(value) {
  const s = String(value ?? '')
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportExpensesCsv(expenses, categoriesById) {
  const headers = ['Date', 'Expense', 'Category', 'Paid To', 'Payment Mode', 'Reference No', 'Notes', 'Amount']
  const rows = expenses.map((e) => [
    e.date,
    e.title,
    categoryName(categoriesById, e.categoryId),
    e.paidTo || '',
    getPaymentModeLabel(e.paymentMode),
    e.referenceNo || '',
    e.notes || '',
    e.amount,
  ])
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const lines = [headers, ...rows, ['', '', '', '', '', '', 'Total', total]]
  const csv = lines.map((row) => row.map(csvCell).join(',')).join('\r\n')
  downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), fileName('expenses', 'csv'))
}

const NAVY = [27, 42, 74]
const RED = [179, 38, 30]
const GREY = [102, 102, 102]
const TEXT = [26, 26, 26]
const RULE = [210, 214, 222]

const money = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigits(n) {
  if (n < 20) return ONES[n]
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? '-' + ONES[n % 10] : ''}`
}

function threeDigits(n) {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  if (!hundreds) return twoDigits(rest)
  return `${ONES[hundreds]} Hundred${rest ? ` and ${twoDigits(rest)}` : ''}`
}

function integerInWords(n) {
  if (n === 0) return 'Zero'
  const crore = Math.floor(n / 10000000); n %= 10000000
  const lakh = Math.floor(n / 100000); n %= 100000
  const thousand = Math.floor(n / 1000); n %= 1000
  const parts = []
  if (crore) parts.push(`${integerInWords(crore)} Crore`)
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`)
  if (n) parts.push(threeDigits(n))
  return parts.join(', ')
}

function amountInWords(amount) {
  const paise = Math.round(amount * 100)
  const rupees = Math.floor(paise / 100)
  const rest = paise % 100
  return `Rupees ${integerInWords(rupees)}${rest ? `, and Paise ${twoDigits(rest)}` : ''} Only`
}

const longDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

function describePeriod(expenses, month) {
  if (month) {
    const [y, m] = month.split('-').map(Number)
    return `${longDate(new Date(y, m - 1, 1))} to ${longDate(new Date(y, m, 0))}`
  }
  if (!expenses.length) return 'All dates'
  const dates = expenses.map((e) => e.date).sort()
  return `${formatExpenseDate(dates[0])} to ${formatExpenseDate(dates[dates.length - 1])}`
}

async function loadImage(src, maxWidth, { knockoutWhite = false } = {}) {
  try {
    const img = new Image()
    img.src = src
    await img.decode()
    const scale = Math.min(1, maxWidth / img.naturalWidth)
    const w = Math.round(img.naturalWidth * scale)
    const h = Math.round(img.naturalHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    if (knockoutWhite) {
      const pixels = ctx.getImageData(0, 0, w, h)
      const d = pixels.data
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 225 && d[i + 1] > 225 && d[i + 2] > 225) d[i + 3] = 0
      }
      ctx.putImageData(pixels, 0, 0)
    }
    return { data: canvas.toDataURL('image/png'), ratio: h / w }
  } catch {
    return null
  }
}

const pad = (n) => String(n).padStart(2, '0')

async function createTrustDoc({ runningTitle, footerText }) {
  const [{ jsPDF }, { autoTable }, logo, watermark, seal, signature] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
    loadImage(logoUrl, 400),
    loadImage(watermarkUrl, 800),
    loadImage(sealUrl, 500),
    loadImage(signatureUrl, 600, { knockoutWhite: true }),
  ])

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 40
  const contentW = W - M * 2
  const now = new Date()

  const watermarked = new Set()
  const drawWatermark = () => {
    const page = doc.getCurrentPageInfo().pageNumber
    if (!watermark || watermarked.has(page)) return
    watermarked.add(page)
    const size = 300
    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity: 0.06 }))
    doc.addImage(watermark.data, 'PNG', (W - size) / 2, (H - size * watermark.ratio) / 2, size, size * watermark.ratio)
    doc.restoreGraphicsState()
  }

  const drawRunningHeader = (title = runningTitle) => {
    doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...NAVY)
    doc.text(TRUST_NAME, M, 30)
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...GREY)
    doc.text(title, W - M, 30, { align: 'right' })
    doc.setDrawColor(...RULE).setLineWidth(0.5).line(M, 37, W - M, 37)
  }

  const drawLetterhead = (title, subLines) => {
    drawWatermark()
    let y = 34
    if (logo) {
      const lw = 42
      doc.addImage(logo.data, 'PNG', (W - lw) / 2, y, lw, lw * logo.ratio)
      y += lw * logo.ratio + 16
    }
    doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(...NAVY)
    doc.text(TRUST_NAME, W / 2, y, { align: 'center' })
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...GREY)
    doc.text(TRUST_ADDRESS, W / 2, (y += 13), { align: 'center' })
    doc.text(TRUST_CONTACT, W / 2, (y += 11), { align: 'center' })
    y += 9
    doc.setDrawColor(...NAVY).setLineWidth(1.2).line(M, y, W - M, y)
    doc.setLineWidth(0.4).line(M, y + 2.5, W - M, y + 2.5)

    doc.setFont('helvetica', 'bold').setFontSize(15).setTextColor(...NAVY)
    doc.text(title, W / 2, (y += 26), { align: 'center' })
    doc.setFont('helvetica', 'normal').setTextColor(...GREY)
    subLines.forEach((line, i) => {
      doc.setFontSize(i === 0 ? 9.5 : 8.5).text(line, W / 2, (y += i === 0 ? 14 : 12), { align: 'center' })
    })
    return y
  }

  const ensureSpace = (y, needed) => {
    if (y + needed <= H - 56) return y
    doc.addPage()
    drawWatermark()
    drawRunningHeader()
    return 56
  }

  const drawAmountInWords = (y, amount) => {
    doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...TEXT)
    const label = 'Amount in words: '
    const labelW = doc.getTextWidth(label)
    doc.text(label, M, y)
    doc.setFont('helvetica', 'normal')
    const words = doc.splitTextToSize(amountInWords(amount), contentW - labelW)
    doc.text(words, M + labelW, y)
    return y + words.length * 11 + 12
  }

  const drawSignOff = (y, declarationText) => {
    y = ensureSpace(y, 150)
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...GREY)
    const declaration = doc.splitTextToSize(declarationText, contentW)
    doc.text(declaration, M, y)
    y += declaration.length * 11 + 18

    const sigX = 320
    if (seal) doc.addImage(seal.data, 'PNG', M, y - 8, 160, 160 * seal.ratio)
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...TEXT)
    doc.text('Place : Udumalpet', M, y + 80)
    doc.text(`Date   : ${longDate(now)}`, M, y + 93)

    doc.text('For,', sigX, y + 4)
    doc.setFont('helvetica', 'bold').setTextColor(...RED)
    doc.text(TRUST_NAME, sigX + doc.getTextWidth('For, '), y + 4)
    if (signature) doc.addImage(signature.data, 'PNG', sigX + 20, y + 10, 66 / signature.ratio, 66)
    doc.setFont('helvetica', 'normal').setTextColor(...TEXT)
    doc.text('Managing Trustee / Authorized Signatory', sigX, y + 86)
    return y + 100
  }

  const drawFooters = (totalPages = doc.getNumberOfPages()) => {
    const pages = doc.getNumberOfPages()
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p)
      doc.setDrawColor(...RULE).setLineWidth(0.5).line(M, H - 40, W - M, H - 40)
      doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(140)
      doc.text(footerText, M, H - 28)
      doc.text(`Page ${p} of ${totalPages}`, W - M, H - 28, { align: 'right' })
    }
  }

  const tableHooks = {
    willDrawPage: (data) => {
      drawWatermark()
      if (data.pageNumber > 1) drawRunningHeader()
    },
  }

  return {
    doc, autoTable, W, H, M, contentW, tableHooks,
    drawRunningHeader, drawLetterhead, ensureSpace, drawAmountInWords, drawSignOff, drawFooters,
  }
}

export async function exportExpensesPdf(expenses, categoriesById, { month } = {}) {
  const now = new Date()
  const reportNo = `EXP-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  const t = await createTrustDoc({
    runningTitle: `Statement of Expenses (continued)  ·  ${reportNo}`,
    footerText: `${reportNo}  ·  This is a computer-generated statement from the Trust's expense records.`,
  })
  const { doc, autoTable, M, tableHooks } = t
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const y0 = t.drawLetterhead('STATEMENT OF EXPENSES', [
    `For the period ${describePeriod(expenses, month)}`,
    `Report No. ${reportNo}`,
  ])

  autoTable(doc, {
    ...tableHooks,
    startY: y0 + 14,
    margin: { top: 50, bottom: 56, left: M, right: M },
    theme: 'grid',
    head: [['S.No', 'Date', 'Particulars', 'Category', 'Paid To', 'Mode / Ref.', 'Amount (Rs.)']],
    body: expenses.map((e, i) => [
      i + 1,
      formatExpenseDate(e.date),
      e.notes ? `${e.title}\n${e.notes}` : e.title,
      categoryName(categoriesById, e.categoryId),
      e.paidTo || '-',
      e.referenceNo ? `${getPaymentModeLabel(e.paymentMode)}\n${e.referenceNo}` : getPaymentModeLabel(e.paymentMode),
      money(e.amount),
    ]),
    foot: [[{ content: 'TOTAL', colSpan: 6, styles: { halign: 'right' } }, money(total)]],
    showFoot: 'lastPage',
    showHead: 'everyPage',
    rowPageBreak: 'avoid',
    styles: { fontSize: 8, cellPadding: 4, valign: 'top', textColor: TEXT, lineColor: RULE, lineWidth: 0.5, overflow: 'linebreak' },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', valign: 'middle', lineColor: NAVY },
    footStyles: { fillColor: [235, 238, 245], textColor: NAVY, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fillColor: false },
    columnStyles: {
      0: { cellWidth: 26, halign: 'center' },
      1: { cellWidth: 60 },
      3: { cellWidth: 64 },
      4: { cellWidth: 64 },
      5: { cellWidth: 72 },
      6: { cellWidth: 70, halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 0) data.cell.styles.halign = 'center'
      if (data.column.index === 6) data.cell.styles.halign = 'right'
    },
  })

  let y = t.ensureSpace(doc.lastAutoTable.finalY + 14, 20)
  y = t.drawAmountInWords(y, total)

  const byCategory = new Map()
  expenses.forEach((e) => {
    const row = byCategory.get(e.categoryId) || { count: 0, amount: 0 }
    row.count += 1
    row.amount += e.amount
    byCategory.set(e.categoryId, row)
  })
  const summary = [...byCategory.entries()].sort((a, b) => b[1].amount - a[1].amount)

  y = t.ensureSpace(y + 16, 60)
  doc.setFont('helvetica', 'bold').setFontSize(10.5).setTextColor(...NAVY)
  doc.text('Category-wise Summary', M, y)
  autoTable(doc, {
    ...tableHooks,
    startY: y + 6,
    margin: { top: 50, bottom: 56, left: M, right: M },
    tableWidth: 340,
    theme: 'grid',
    head: [['Category', 'Entries', 'Amount (Rs.)', '% of Total']],
    body: summary.map(([id, { count, amount }]) => [
      categoryName(categoriesById, id),
      count,
      money(amount),
      total ? `${((amount / total) * 100).toFixed(1)}%` : '-',
    ]),
    foot: [['Total', expenses.length, money(total), total ? '100.0%' : '-']],
    styles: { fontSize: 8, cellPadding: 4, textColor: TEXT, lineColor: RULE, lineWidth: 0.5 },
    bodyStyles: { fillColor: false },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', lineColor: NAVY },
    footStyles: { fillColor: [235, 238, 245], textColor: NAVY, fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'center', cellWidth: 50 }, 2: { halign: 'right', cellWidth: 90 }, 3: { halign: 'right', cellWidth: 60 } },
    didParseCell: (data) => {
      if (data.section !== 'body' && data.column.index === 1) data.cell.styles.halign = 'center'
      if (data.section !== 'body' && data.column.index >= 2) data.cell.styles.halign = 'right'
    },
  })

  t.drawSignOff(
    doc.lastAutoTable.finalY + 22,
    'Certified that the expenses listed above were incurred towards the objects of the Trust, are true and correct ' +
      'to the best of our knowledge, and are supported by bills / vouchers maintained in the records of the Trust.',
  )
  t.drawFooters()
  doc.save(fileName('expense-statement', 'pdf'))
}

async function loadBill(url, pathHint) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('could not download it')
  const blob = await res.blob()
  if (blob.type === 'application/pdf' || /\.pdf$/i.test(pathHint || '')) {
    return { kind: 'pdf', bytes: new Uint8Array(await blob.arrayBuffer()) }
  }

  const objectUrl = URL.createObjectURL(blob)
  try {
    const image = await loadImage(objectUrl, 2000)
    if (!image) throw new Error('the image could not be read')
    return { kind: 'image', ...image }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function exportExpenseVoucherPdf(expense, categoriesById, { billUrl } = {}) {
  const voucherNo = `EXV-${expense.id.slice(0, 8).toUpperCase()}`
  const footerText = `${voucherNo}  ·  This is a computer-generated voucher from the Trust's expense records.`
  const billTitle = `Bill / Receipt  ·  ${voucherNo}`

  let bill = null
  let billError = ''
  if (billUrl) {
    try {
      bill = await loadBill(billUrl, expense.billPath)
    } catch (err) {
      billError = err.message || 'unknown error'
    }
  }

  let pdfLib = null
  let billPdf = null
  if (bill?.kind === 'pdf') {
    try {
      pdfLib = await import('pdf-lib')
      billPdf = await pdfLib.PDFDocument.load(bill.bytes, { ignoreEncryption: true })
    } catch {
      bill = null
      billError = 'the PDF could not be read'
    }
  }

  const t = await createTrustDoc({ runningTitle: `Expense Voucher  ·  ${voucherNo}`, footerText })
  const { doc, autoTable, W, H, M, contentW, tableHooks } = t

  const y0 = t.drawLetterhead('EXPENSE VOUCHER', [
    `Voucher No. ${voucherNo}  ·  Dated ${formatExpenseDate(expense.date)}`,
  ])

  const billPageCount = billPdf ? billPdf.getPageCount() : bill ? 1 : 0
  const billStatus = bill
    ? `Attached - see the following page${billPageCount > 1 ? 's' : ''}`
    : billError
      ? `Uploaded, but could not be attached (${billError})`
      : 'Not attached'
  const stamp = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-')

  const rows = [
    ['Voucher No.', voucherNo],
    ['Expense Date', formatExpenseDate(expense.date)],
    ['Particulars', expense.title],
    ['Category', categoryName(categoriesById, expense.categoryId)],
    ['Paid To', expense.paidTo || '-'],
    ['Payment Mode', getPaymentModeLabel(expense.paymentMode)],
    ['Reference / Txn No.', expense.referenceNo || '-'],
    ['Purpose / Notes', expense.notes || '-'],
    ['Bill / Receipt', billStatus],
    ['Recorded By', `${expense.createdByEmail || '-'}  on  ${stamp(expense.createdAt)}`],
  ]
  if (expense.updatedByEmail && new Date(expense.updatedAt) - new Date(expense.createdAt) > 60 * 1000) {
    rows.push(['Last Updated By', `${expense.updatedByEmail}  on  ${stamp(expense.updatedAt)}`])
  }

  autoTable(doc, {
    ...tableHooks,
    startY: y0 + 18,
    margin: { top: 50, bottom: 56, left: M, right: M },
    theme: 'grid',
    body: rows,
    styles: { fontSize: 9, cellPadding: { top: 6, bottom: 6, left: 8, right: 8 }, lineColor: RULE, lineWidth: 0.5, textColor: TEXT, valign: 'top' },
    bodyStyles: { fillColor: false },
    columnStyles: { 0: { cellWidth: 130, fontStyle: 'bold', textColor: GREY, fillColor: [246, 247, 250] } },
  })

  let y = t.ensureSpace(doc.lastAutoTable.finalY + 16, 60)
  const words = doc.setFont('helvetica', 'italic').setFontSize(8.5).splitTextToSize(amountInWords(expense.amount), contentW - 24)
  const boxH = 34 + words.length * 11
  doc.setFillColor(235, 238, 245).setDrawColor(...NAVY).setLineWidth(0.8)
  doc.rect(M, y, contentW, boxH, 'FD')
  doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...NAVY)
  doc.text('AMOUNT PAID', M + 12, y + 19)
  doc.setFontSize(16).text(`Rs. ${money(expense.amount)}`, W - M - 12, y + 21, { align: 'right' })
  doc.setFont('helvetica', 'italic').setFontSize(8.5).setTextColor(...TEXT)
  doc.text(words, M + 12, y + 36)
  y += boxH + 26

  t.drawSignOff(
    y,
    'Certified that the above expense was incurred towards the objects of the Trust, is true and correct to the best ' +
      'of our knowledge, and is supported by the bill / receipt attached to this voucher.',
  )

  const top = 52
  const availH = H - top - 60
  const fit = (srcW, srcH) => {
    const scale = Math.min(contentW / srcW, availH / srcH)
    return { w: srcW * scale, h: srcH * scale, x: (W - srcW * scale) / 2 }
  }

  if (bill?.kind === 'image') {
    doc.addPage()
    t.drawRunningHeader(billTitle)
    const { w, h, x } = fit(1, bill.ratio)
    doc.addImage(bill.data, 'PNG', x, top, w, h)
    doc.setDrawColor(...RULE).setLineWidth(0.5).rect(x, top, w, h)
  }

  const voucherPages = doc.getNumberOfPages()
  t.drawFooters(voucherPages + (billPdf ? billPdf.getPageCount() : 0))

  const name = `expense-voucher-${voucherNo}.pdf`
  if (!billPdf) return doc.save(name)

  const { PDFDocument, StandardFonts, rgb } = pdfLib
  const merged = await PDFDocument.load(doc.output('arraybuffer'))
  const [bold, regular] = await Promise.all([merged.embedFont(StandardFonts.HelveticaBold), merged.embedFont(StandardFonts.Helvetica)])
  const embedded = await merged.embedPdf(billPdf, billPdf.getPageIndices())
  const color = ([r, g, b]) => rgb(r / 255, g / 255, b / 255)
  const total = voucherPages + embedded.length
  const rightText = (page, text, y, size, font, c) =>
    page.drawText(text, { x: W - M - font.widthOfTextAtSize(text, size), y, size, font, color: c })

  embedded.forEach((src, i) => {
    const page = merged.addPage([W, H])
    page.drawText(TRUST_NAME, { x: M, y: H - 30, size: 9, font: bold, color: color(NAVY) })
    rightText(page, billTitle, H - 30, 8.5, regular, color(GREY))
    page.drawLine({ start: { x: M, y: H - 37 }, end: { x: W - M, y: H - 37 }, thickness: 0.5, color: color(RULE) })

    const { w, h, x } = fit(src.width, src.height)
    page.drawPage(src, { x, y: H - top - h, width: w, height: h })
    page.drawRectangle({ x, y: H - top - h, width: w, height: h, borderColor: color(RULE), borderWidth: 0.5 })

    page.drawLine({ start: { x: M, y: 40 }, end: { x: W - M, y: 40 }, thickness: 0.5, color: color(RULE) })
    page.drawText(footerText, { x: M, y: 26, size: 7.5, font: regular, color: color([140, 140, 140]) })
    rightText(page, `Page ${voucherPages + i + 1} of ${total}`, 26, 7.5, regular, color([140, 140, 140]))
  })

  downloadBlob(new Blob([await merged.save()], { type: 'application/pdf' }), name)
}
