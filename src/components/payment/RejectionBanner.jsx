import { XCircle } from 'lucide-react'

export default function RejectionBanner({ reason }) {
  return (
    <div className="bg-red-50 border border-brand-red/30 rounded-xl p-4 my-6">
      <p className="text-sm font-semibold text-brand-red flex items-center gap-2 mb-1">
        <XCircle className="w-4 h-4" /> Payment Rejected
      </p>
      <p className="text-sm text-brand-text">{reason || 'The submitted transaction could not be verified.'}</p>
    </div>
  )
}
