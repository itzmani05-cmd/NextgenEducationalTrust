import { Upload } from 'lucide-react'
import OptionPills from '../apply/fields/OptionPills.jsx'
import TextField from '../apply/fields/TextField.jsx'
import PaymentInstructions from './PaymentInstructions.jsx'

const METHOD_OPTIONS = [
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
]

export default function PaymentForm({
  method,
  onMethodChange,
  transactionId,
  onTransactionIdChange,
  paymentDate,
  onPaymentDateChange,
  amountPaid,
  onAmountPaidChange,
  amountDue,
  proof,
  fileRef,
  proofSizeError,
  onProofChange,
  submitError,
  submitting,
  isResubmit,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 mt-6 space-y-5">
      <OptionPills label="Payment Method" required value={method} onChange={onMethodChange} options={METHOD_OPTIONS} />
      <PaymentInstructions method={method} />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          label="Payment Transaction ID"
          required
          value={transactionId}
          onChange={onTransactionIdChange}
          placeholder="e.g. UPI Ref / UTR number"
        />
        <TextField label="Payment Date" type="date" required value={paymentDate} onChange={onPaymentDateChange} />
      </div>

      <TextField
        label="Amount Paid (₹)"
        type="number"
        required
        value={amountPaid}
        onChange={onAmountPaidChange}
        placeholder={String(amountDue)}
      />

      <label className="block">
        <span className="block text-sm font-medium text-brand-text mb-1.5">
          Payment Screenshot / Proof <span className="text-brand-red">*</span>
        </span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-border rounded-xl py-6 text-sm font-medium text-brand-navy hover:border-brand-navy hover:bg-brand-surface transition-colors"
        >
          <span className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> {proof ? proof.name : 'Upload screenshot or PDF'}
          </span>
          {!proof && <span className="text-xs font-normal text-brand-muted">Up to 1MB</span>}
        </button>
        {proofSizeError && <p className="text-sm text-brand-red mt-1.5">{proofSizeError}</p>}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => onProofChange(e.target.files?.[0] || null)}
        />
      </label>

      {submitError && <p className="text-sm text-brand-red">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-red text-white font-semibold text-sm py-3 rounded-lg shadow-sm hover:bg-brand-redDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : isResubmit ? 'Resubmit Payment Details' : 'Submit Payment Details'}
      </button>
    </form>
  )
}
