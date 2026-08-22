import { Download } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

export default function DownloadApplicationSection({ downloadError, downloadBusy, onDownload }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-1 flex items-center gap-2">
        <Download className="w-4 h-4" /> {enOnly('admin.detail.downloadApplication')}
      </h3>
      <p className="text-xs text-brand-muted mb-4">{enOnly('admin.detail.downloadApplicationHelper')}</p>
      {downloadError && <p className="text-sm text-brand-red mb-3">{downloadError}</p>}
      <button
        type="button"
        onClick={onDownload}
        disabled={downloadBusy}
        className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
      >
        <Download className="w-4 h-4" /> {downloadBusy ? enOnly('admin.detail.preparingDownload') : enOnly('admin.detail.downloadApplication')}
      </button>
    </div>
  )
}
