import { CheckCircle2, XCircle, Circle } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

function DocStatusIcon({ status, active }) {
  if (status === 'approved') return <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-green-600'}`} />
  if (status === 'rejected') return <XCircle className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-brand-red'}`} />
  return <Circle className={`w-3.5 h-3.5 ${active ? 'text-white/70' : 'text-brand-muted'}`} />
}

const STATUS_TONE = {
  approved: 'bg-green-50 text-green-700 border-green-200 hover:border-green-300',
  rejected: 'bg-red-50 text-brand-red border-red-200 hover:border-red-300',
}

export default function DocumentTabs({ docs, documentReviews, selectedDoc, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 border-b border-brand-border bg-brand-surface/50">
      {docs.map((doc) => {
        const status = documentReviews?.[doc.key]?.status
        const active = doc.key === selectedDoc
        return (
          <button
            key={doc.key}
            type="button"
            onClick={() => onSelect(doc.key)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
              active
                ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                : `${STATUS_TONE[status] || 'bg-white text-brand-muted border-brand-border'} hover:text-brand-text`
            }`}
          >
            <DocStatusIcon status={status} active={active} />
            {enOnly(doc.labelKey)}
          </button>
        )
      })}
    </div>
  )
}
