import StatusBadge from '../admin/StatusBadge.jsx'

export default function ApplicationReferenceCard({ application }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="text-xs text-brand-muted uppercase tracking-wide">Reference Number</p>
        <p className="font-bold text-brand-navy">NGC-{application.id.slice(0, 8).toUpperCase()}</p>
      </div>
      <StatusBadge status={application.status} />
    </div>
  )
}
