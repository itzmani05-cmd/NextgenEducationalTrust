import { Link } from 'react-router-dom'
import { enOnly } from '../../../i18n/bilingual.js'
import StatusBadge from '../StatusBadge.jsx'

export default function RecentApplicationsTable({ applications, loading }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
        <h2 className="font-semibold text-brand-text">{enOnly('admin.analytics.recentApplications')}</h2>
        <Link to="/admin/applications" className="text-sm font-semibold text-brand-navy hover:underline">
          {enOnly('admin.analytics.viewAll')}
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {!loading && applications.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-brand-muted">{enOnly('admin.analytics.noApplicationsYet')}</td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                <td className="px-5 py-3">
                  <Link to={`/admin/applications/${app.id}`} className="font-medium text-brand-navy hover:underline">
                    {app.fullName || enOnly('admin.common.dash')}
                  </Link>
                </td>
                <td className="px-5 py-3 text-brand-muted">{app.district || enOnly('admin.common.dash')}</td>
                <td className="px-5 py-3 text-brand-muted">
                  {new Date(app.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-3 text-right">
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
