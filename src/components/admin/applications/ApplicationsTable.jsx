import { Link } from 'react-router-dom'
import { enOnly } from '../../../i18n/bilingual.js'
import StatusBadge from '../StatusBadge.jsx'

export default function ApplicationsTable({ applications, loading }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs text-brand-muted uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colName')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colContact')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colDistrict')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colSubmitted')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-brand-muted">
                  {enOnly('admin.applications.noApplicationsFound')}
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                <td className="px-5 py-3">
                  <Link to={`/admin/applications/${app.id}`} className="font-medium text-brand-navy hover:underline">
                    {app.fullName || enOnly('admin.common.dash')}
                  </Link>
                  <div className="text-xs text-brand-muted">NGC-{app.id.slice(0, 8).toUpperCase()}</div>
                </td>
                <td className="px-5 py-3 text-brand-text">
                  <div>{app.mobile}</div>
                  <div className="text-xs text-brand-muted">{app.email}</div>
                </td>
                <td className="px-5 py-3 text-brand-text">{app.district || enOnly('admin.common.dash')}</td>
                <td className="px-5 py-3 text-brand-muted">
                  {new Date(app.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={app.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
