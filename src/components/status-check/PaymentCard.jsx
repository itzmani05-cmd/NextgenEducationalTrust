import { Link } from 'react-router-dom'
import { LogIn, Wallet } from 'lucide-react'

const PAYMENT_STATUS_TEXT = {
  submitted: 'Payment Submitted — Under Verification',
  approved: 'Payment Verified',
  rejected: 'Payment Rejected',
}

export default function PaymentCard({ payment }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-wide mb-0.5">Payment</p>
          <p className="font-semibold text-brand-text">
            {PAYMENT_STATUS_TEXT[payment.status] || payment.status}
          </p>
        </div>
      </div>
      {payment.status === 'rejected' && payment.rejectionReason && (
        <p className="text-sm text-brand-red mt-2 ml-[52px]">&ldquo;{payment.rejectionReason}&rdquo;</p>
      )}
      {payment.status === 'approved' && (
        <p className="text-sm text-brand-muted mt-2 ml-[52px]">
          Paid ₹{payment.amountPaid?.toLocaleString('en-IN')}
          {payment.verifiedAt && ` · Verified ${new Date(payment.verifiedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
        </p>
      )}
      <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline mt-3 ml-[52px]">
        <LogIn className="w-3.5 h-3.5" /> Sign in to manage payment
      </Link>
    </div>
  )
}
