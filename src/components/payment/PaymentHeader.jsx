import { CreditCard } from 'lucide-react'

export default function PaymentHeader() {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-11 h-11 rounded-full bg-white shadow-sm text-brand-navy flex items-center justify-center shrink-0">
        <CreditCard className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-brand-navy">Payment</h1>
        <p className="text-sm text-brand-muted">
          Complete your scholarship fee payment and submit the transaction details below.
        </p>
      </div>
    </div>
  )
}
