import { CheckCircle2, XCircle, Circle } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

function DocStatusIcon({ status }) {
  if (status === 'approved') return <CheckCircle2 className="w-4 h-4 text-green-600" />
  if (status === 'rejected') return <XCircle className="w-4 h-4 text-brand-red" />
  return <Circle className="w-4 h-4 text-brand-muted" />
}

export default function DocumentTabs({ docs, documentReviews, selectedDoc, onSelect }) {
  return (
    <div className="flex items-center gap-1 border-b border-brand-border overflow-x-auto px-2 pt-2">
      {docs.map((doc) => {
        const status = documentReviews?.[doc.key]?.status
        const active = doc.key === selectedDoc
        return (
          <button
            key={doc.key}
            type="button"
            onClick={() => onSelect(doc.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              active ? 'border-brand-navy text-brand-navy' : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <DocStatusIcon status={status} />
            {enOnly(doc.labelKey)}
          </button>
        )
      })}
    </div>
  )
}
