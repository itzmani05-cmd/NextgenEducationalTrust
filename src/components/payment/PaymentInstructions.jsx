import qrCode from '../../assests/QrPic.jpeg'

// Trust payment details.
const BANK_NAME = 'City Union Bank'
const BANK_ACCOUNT_NAME = 'NEXTGEN SOLUTIONS EDUCATIONAL TRUST'
const BANK_ACCOUNT_NUMBER = '510909010405740'
const BANK_IFSC = 'CIUB0000138'
const BANK_BRANCH = 'Udumalpet'
const BANK_ACCOUNT_TYPE = 'Current Account'

export default function PaymentInstructions({ method }) {
  if (method === 'upi') {
    return (
      <div className="bg-brand-surface rounded-xl p-4 flex flex-col items-center text-center">
        <img
          src={qrCode}
          alt="Scan to pay via UPI"
          className="w-40 h-40 object-contain rounded-lg border border-brand-border bg-white p-2"
        />
        <p className="text-sm text-brand-text font-semibold mt-3">Scan with any UPI app to pay</p>
        <p className="text-xs text-brand-muted mt-1">GPay / PhonePe / Paytm / any UPI-enabled app</p>
      </div>
    )
  }
  if (method === 'bank_transfer') {
    return (
      <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-text space-y-1.5">
        <p>Bank: <span className="font-semibold">{BANK_NAME}</span></p>
        <p>Account Name: <span className="font-semibold">{BANK_ACCOUNT_NAME}</span></p>
        <p>Account Number: <span className="font-semibold">{BANK_ACCOUNT_NUMBER}</span></p>
        <p>IFSC Code: <span className="font-semibold">{BANK_IFSC}</span></p>
        <p>Branch: <span className="font-semibold">{BANK_BRANCH}</span></p>
        <p>Account Type: <span className="font-semibold">{BANK_ACCOUNT_TYPE}</span></p>
      </div>
    )
  }
  return (
    <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-muted">
      Contact the Trust office (nextgencollegesolutions@gmail.com / +91 93423 79043) to arrange payment.
    </div>
  )
}
