import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PaymentWrap({ children }) {
  return (
    <div className="bg-brand-surface min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-12 sm:py-16">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        {children}
      </div>
    </div>
  )
}
