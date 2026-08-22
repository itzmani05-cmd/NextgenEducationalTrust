export default function SummaryCard({ application, amountDue, payment }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="divide-y divide-brand-border">
        <Row label="Application No" value={`NGC-${application.id.slice(0, 8).toUpperCase()}`} />
        <Row label="Course" value={application.college?.degree || application.examName || '—'} />
        <Row label="Original Course Fee" value={`₹${application.courseFee.toLocaleString('en-IN')}`} />
        <Row label="Approved Concession" value={`${application.finalApprovedConcession}%`} />
        <Row
          label="Discount Amount"
          value={`₹${(application.courseFee - amountDue).toLocaleString('en-IN')}`}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 bg-brand-surface rounded-xl px-5 py-4">
        <span className="text-brand-text font-semibold">Amount Payable</span>
        <span className="text-2xl font-extrabold text-brand-navy">₹{amountDue.toLocaleString('en-IN')}</span>
      </div>

      {payment && (
        <div className="pt-4 mt-4 border-t border-brand-border divide-y divide-brand-border">
          <Row label="Transaction ID" value={payment.transactionId} />
          <Row label="Amount Paid" value={`₹${payment.amountPaid?.toLocaleString('en-IN')}`} />
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-brand-muted">{label}</span>
      <span className="text-sm font-semibold text-brand-text text-right">{value}</span>
    </div>
  )
}
