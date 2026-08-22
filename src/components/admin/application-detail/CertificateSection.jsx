import { Award, ExternalLink, RefreshCw } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

export default function CertificateSection({ app, certError, certBusy, onViewCertificate, onGenerateCertificate }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4 flex items-center gap-2">
        <Award className="w-4 h-4" /> {enOnly('admin.detail.certificate')}
      </h3>
      {certError && <p className="text-sm text-brand-red mb-3">{certError}</p>}
      {app.certificate ? (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold text-brand-text">{app.certificate.certificateNumber}</p>
            <p className="text-xs text-brand-muted">
              {enOnly('admin.detail.issued')} {new Date(app.certificate.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button
            type="button"
            onClick={onViewCertificate}
            disabled={certBusy}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
          >
            <ExternalLink className="w-4 h-4" /> {certBusy ? enOnly('admin.common.opening') : enOnly('admin.detail.viewCertificate')}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-brand-muted">
            {enOnly('admin.detail.certApprovedNotGenerated')}
          </p>
          <button
            type="button"
            onClick={onGenerateCertificate}
            disabled={certBusy}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
          >
            <RefreshCw className="w-4 h-4" /> {certBusy ? enOnly('admin.detail.generating') : enOnly('admin.detail.generateCertificate')}
          </button>
        </div>
      )}
    </div>
  )
}
