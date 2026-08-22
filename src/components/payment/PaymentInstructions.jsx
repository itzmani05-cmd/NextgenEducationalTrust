// Trust payment details — configurable via env instead of hardcoded here,
// since there's no admin-editable settings store yet (AdminSettings.jsx is
// still a stub). Set these in the frontend .env before going live.
const UPI_ID = import.meta.env.VITE_PAYMENT_UPI_ID || ''
const BANK_NAME = import.meta.env.VITE_PAYMENT_BANK_NAME || ''
const BANK_ACCOUNT_NAME = import.meta.env.VITE_PAYMENT_BANK_ACCOUNT_NAME || ''
const BANK_ACCOUNT_NUMBER = import.meta.env.VITE_PAYMENT_BANK_ACCOUNT_NUMBER || ''
const BANK_IFSC = import.meta.env.VITE_PAYMENT_BANK_IFSC || ''

export default function PaymentInstructions({ method }) {
  if (method === 'upi') {
    return (
      <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-text">
        {UPI_ID ? (
          <p>Pay to UPI ID: <span className="font-semibold">{UPI_ID}</span></p>
        ) : (
          <p className="text-brand-muted">UPI details aren&apos;t configured yet — contact the Trust office.</p>
        )}
      </div>
    )
  }
  if (method === 'bank_transfer') {
    return (
      <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-text space-y-1">
        {BANK_NAME ? (
          <>
            <p>Bank: <span className="font-semibold">{BANK_NAME}</span></p>
            <p>Account Name: <span className="font-semibold">{BANK_ACCOUNT_NAME}</span></p>
            <p>Account Number: <span className="font-semibold">{BANK_ACCOUNT_NUMBER}</span></p>
            <p>IFSC: <span className="font-semibold">{BANK_IFSC}</span></p>
          </>
        ) : (
          <p className="text-brand-muted">Bank details aren&apos;t configured yet — contact the Trust office.</p>
        )}
      </div>
    )
  }
  return (
    <div className="bg-brand-surface rounded-xl p-4 text-sm text-brand-muted">
      Contact the Trust office (nextgencollegesolutions@gmail.com / +91 93423 79043) to arrange payment.
    </div>
  )
}
