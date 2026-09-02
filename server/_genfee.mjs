import fs from 'fs'
import { renderFeeReceiptPdf } from './src/studentFeeReceipt.js'

const application = {
  id: 'a1b2c3d4-e5f6-4789-9abc-def012345678',
  fullName: 'Priyanka Ramachandran',
  email: 'priyanka@example.com',
  mobile: '9876543210',
  examName: 'Full Stack Web Development',
  courseFee: 25000,
  annualIncome: '1_5_to_3',
  tenth: { percentage: 65 },
  twelfth: { percentage: 65 },
  concessionCategory: 'category3',
  finalApprovedConcession: 43,
}

const payment = {
  amountDue: 14250,
  amountPaid: 14250,
  paymentMethod: 'bank_transfer',
  paymentDate: new Date('2026-08-20'),
  transactionId: 'HDFC2026082098765',
}

const buf = await renderFeeReceiptPdf({ receiptNumber: 'NGF/2026/00001', application, payment, issuedAt: new Date() })
fs.writeFileSync('../docs/fee-receipt.pdf', buf)
console.log('written', buf.length)
