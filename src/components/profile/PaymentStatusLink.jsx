import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function PaymentStatusLink({ payment }) {
  if (payment?.status === 'rejected') {
    return (
      <Link
        to="/payment"
        className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors mb-6"
      >
        Resubmit Payment Details <ArrowRight className="w-4 h-4" />
      </Link>
    )
  }
  if (payment?.status === 'submitted') {
    return (
      <Link
        to="/payment"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:underline mb-6"
      >
        View payment details <ArrowRight className="w-4 h-4" />
      </Link>
    )
  }
  return null
}
