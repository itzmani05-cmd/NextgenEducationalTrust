import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import StatusBadge from '../StatusBadge.jsx'
import { enOnly } from '../../../i18n/bilingual.js'

export default function ApplicantHeader({ app }) {
  return (
    <>
      <Link to="/admin/applications" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> {enOnly('admin.detail.backToApplications')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">{app.fullName}</h1>
          <p className="text-brand-muted text-sm">
            {enOnly('admin.detail.submittedOn')} {new Date(app.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={app.status} />
          <Link
            to={`/admin/verification/${app.id}`}
            className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> {enOnly('admin.detail.reviewDocuments')}
          </Link>
        </div>
      </div>
    </>
  )
}
