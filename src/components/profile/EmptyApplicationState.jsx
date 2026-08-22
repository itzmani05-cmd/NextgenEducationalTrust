import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'

export default function EmptyApplicationState() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 mb-6 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center mx-auto mb-4">
        <FileText className="w-5 h-5" />
      </div>
      <p className="text-sm text-brand-muted mb-5">You haven&apos;t submitted an application yet.</p>
      <Link
        to="/apply"
        className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors"
      >
        Start Application <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
