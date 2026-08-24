import fs from 'fs'
import { renderReceiptPdf } from './src/receipt.js'

const donation = {
  fullName: 'Venkataraghavan Subramaniam Iyer',
  email: 'venkat@example.com',
  mobile: '9876543210',
  pan: 'ABCDE1234F',
  amount: 25000,
  transactionRef: 'UPI2026082412345',
  purpose: 'General Fund',
  createdAt: new Date('2026-08-20'),
}

const buf = await renderReceiptPdf({ receiptNumber: 'NGD/2026/00001', donation, issuedAt: new Date() })
fs.writeFileSync('../docs/donation-receipt.pdf', buf)
console.log('written', buf.length)
