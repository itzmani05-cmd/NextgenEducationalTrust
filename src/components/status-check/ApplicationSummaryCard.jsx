import StatusBadge from '../admin/StatusBadge.jsx'

export default function ApplicationSummaryCard({ app }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="font-bold text-brand-text">{app.fullName}</p>
        <p className="text-xs text-brand-muted">NGC-{app.id.slice(0, 8).toUpperCase()}</p>
      </div>
      <StatusBadge status={app.status} />
    </div>
  )
}
