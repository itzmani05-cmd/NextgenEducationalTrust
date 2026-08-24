import fs from 'fs'
import { renderFeeReceiptPdf } from './src/studentFeeReceipt.js'

const application = {
  id: 'a1b2c3d4-e5f6-4789-9abc-def012345678',
  fullName: 'Priyanka Ramachandran',
  email: 'priyanka@example.com',
  mobile: '9876543210',
  examName: 'Full Stack Web Development',
  courseFee: 25000,
  finalApprovedConcession: 20,
}

const payment = {
  amountDue: 20000,
  amountPaid: 20000,
  paymentMethod: 'bank_transfer',
  paymentDate: new Date('2026-08-20'),
  transactionId: 'HDFC2026082098765',
}

const buf = await renderFeeReceiptPdf({ receiptNumber: 'NGF/2026/00001', application, payment, issuedAt: new Date() })
fs.writeFileSync('../docs/fee-receipt.pdf', buf)
console.log('written', buf.length)
