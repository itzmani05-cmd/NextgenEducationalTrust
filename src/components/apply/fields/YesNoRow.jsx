import { bi } from '../../../i18n/bilingual.js'

export default function YesNoRow({ question, helper, value, onChange, yesLabel, noLabel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-brand-border last:border-0">
      <div>
        <p className="font-medium text-brand-text">{question}</p>
        {helper && <p className="text-sm text-brand-muted mt-0.5">{helper}</p>}
      </div>
      <div className="flex items-center gap-6 shrink-0">
        {[
          { v: 'yes', l: yesLabel || bi('common.yes') },
          { v: 'no', l: noLabel || bi('common.no') },
        ].map((opt) => (
          <button
            type="button"
            key={opt.v}
            onClick={() => onChange(opt.v)}
            className="flex items-center gap-2 text-sm font-medium text-brand-text"
          >
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt.v ? 'border-brand-navy' : 'border-brand-border'
              }`}
            >
              {value === opt.v && <span className="w-2 h-2 rounded-full bg-brand-navy" />}
            </span>
            {opt.l}
          </button>
        ))}
      </div>
    </div>
  )
}
