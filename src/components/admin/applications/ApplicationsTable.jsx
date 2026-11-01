import { Link } from 'react-router-dom'
import { Download, Eye, Loader2, Trash2 } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'
import StatusBadge from '../StatusBadge.jsx'
import Pagination from '../Pagination.jsx'

export default function ApplicationsTable({ applications, loading, startIndex = 0, pagination = null, onDelete, onDownload, downloadingId = null }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs text-brand-muted uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold w-16">S.No</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colName')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colContact')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colDistrict')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colSubmitted')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.applications.colStatus')}</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-brand-muted">
                  {enOnly('admin.applications.noApplicationsFound')}
                </td>
              </tr>
            )}
            {applications.map((app, index) => (
              <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors">
                <td className="px-5 py-3 text-brand-muted tabular-nums">{startIndex + index + 1}</td>
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
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/applications/${app.id}`} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-navy" title="View application" aria-label="View application">
                      <Eye className="w-4 h-4" />
                    </Link>
                    {onDownload && (
                      <button type="button" onClick={() => onDownload(app)} disabled={downloadingId === app.id} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-navy disabled:opacity-50" title="Download application PDF" aria-label="Download application PDF">
                        {downloadingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      </button>
                    )}
                    {onDelete && (
                      <button type="button" onClick={() => onDelete(app)} className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-surface hover:text-brand-red" title="Delete application" aria-label="Delete application">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination {...pagination} itemLabel="applications" />}
    </div>
  )
}
