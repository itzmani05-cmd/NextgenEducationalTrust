import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, IndianRupee } from 'lucide-react'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-brand-muted">{label}</span>
      <span className="text-sm font-semibold text-brand-text text-right">{value}</span>
    </div>
  )
}

export default function ApprovalCard({ application }) {
  const amountDue = Math.round(application.courseFee * (100 - application.finalApprovedConcession) / 100)
  const discount = application.courseFee - amountDue

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="bg-green-50 border-b border-green-100 px-6 sm:px-8 py-6 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-brand-text">Your application has been approved</h2>
          <p className="text-sm text-brand-muted">Review the concession below and proceed to payment.</p>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6">
        <div className="divide-y divide-brand-border">
          <Row label="Application No" value={`NGC-${application.id.slice(0, 8).toUpperCase()}`} />
          <Row label="Course" value={application.college?.degree || application.examName || '—'} />
          <Row label="Original Course Fee" value={`₹${application.courseFee.toLocaleString('en-IN')}`} />
          <Row label="Approved Concession" value={`${application.finalApprovedConcession}%`} />
          <Row label="Discount Amount" value={`₹${discount.toLocaleString('en-IN')}`} />
          {application.concessionDecidedAt && (
            <Row
              label="Approval Date"
              value={new Date(application.concessionDecidedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mt-4 mb-6 bg-brand-surface rounded-xl px-5 py-4">
          <span className="text-brand-text font-semibold flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4" /> Amount Payable
          </span>
          <span className="text-2xl font-extrabold text-brand-navy">₹{amountDue.toLocaleString('en-IN')}</span>
        </div>

        <Link
          to="/payment"
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors"
        >
          Proceed to Payment <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
