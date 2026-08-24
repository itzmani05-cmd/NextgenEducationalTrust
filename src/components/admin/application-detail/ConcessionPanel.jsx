import { enOnly } from '../../../i18n/bilingual.js'

const CONCESSION_OPTIONS = [
  { value: 'category1', labelKey: 'admin.detail.concession.category1', sub: () => enOnly('admin.detail.concession.discount100') },
  { value: 'category2', labelKey: 'admin.detail.concession.category2', sub: () => enOnly('admin.detail.concession.discount50') },
  {
    value: 'category3',
    labelKey: 'admin.detail.concession.category3',
    sub: (s) => `25% / 40% / 50% base + factors, capped at 50% — calculated ${s?.provisional ?? 0}%`,
  },
  { value: 'category4', labelKey: 'admin.detail.concession.category4', sub: () => enOnly('admin.detail.concession.noDiscount') },
  { value: 'exceptional', labelKey: 'admin.detail.concession.exceptional', sub: () => enOnly('admin.detail.concession.trustCommitteeReview') },
]

export default function ConcessionPanel({
  app,
  suggestion,
  concessionCategory,
  onCategorySelect,
  finalAmount,
  onFinalAmountChange,
  concessionNote,
  onConcessionNoteChange,
  courseFee,
  onCourseFeeChange,
  concessionError,
  savingConcession,
  onSave,
}) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-1">
        {enOnly('admin.detail.discountConcession')}
      </h3>
      <p className="text-xs text-brand-muted mb-5">
        {enOnly('admin.detail.systemCalculated')} <span className="font-semibold text-brand-text">{app.calculatedConcession ?? 0}%</span>{' '}
        {enOnly('admin.detail.fromAnswers')}
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {CONCESSION_OPTIONS.map((opt) => {
          const active = concessionCategory === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onCategorySelect(opt.value)}
              className={`text-left rounded-lg border p-4 transition-colors ${
                active ? 'border-brand-navy ring-2 ring-brand-navy/20' : 'border-brand-border hover:border-brand-navy/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-semibold text-brand-text text-sm">{enOnly(opt.labelKey)}</span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? 'border-brand-navy' : 'border-brand-border'
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-brand-navy" />}
                </span>
              </div>
              <p className="text-xs text-brand-muted">{opt.sub(suggestion)}</p>
            </button>
          )
        })}
      </div>

      {concessionCategory === 'category3' && suggestion && (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4 mb-5 text-sm">
          <div className="flex items-center justify-between py-1">
            <span className="text-brand-muted">{enOnly('admin.detail.base')} ({suggestion.category.label})</span>
            <span className="font-medium text-brand-text">{suggestion.base}%</span>
          </div>
          {suggestion.additions.map((a) => (
            <div key={a.label} className="flex items-center justify-between py-1">
              <span className="text-brand-text">{a.label}</span>
              <span className="font-medium text-brand-navy">+{a.value}%</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-1 border-t border-brand-border mt-1 pt-2">
            <span className="text-brand-text font-medium">{enOnly('admin.detail.calculated')}</span>
            <span className="font-bold text-brand-text">
              {suggestion.calculated}% ({enOnly('admin.detail.cappedAt')} {suggestion.cap}% → {suggestion.provisional}%)
            </span>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4 max-w-xl">
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.detail.originalCourseFee')}</span>
          <input
            type="number"
            min="1"
            value={courseFee}
            onChange={(e) => onCourseFeeChange(e.target.value)}
            placeholder="e.g. 20000"
            className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-brand-text mb-1.5">{enOnly('admin.detail.finalApprovedConcession')}</span>
          <input
            type="number"
            min="0"
            max="100"
            value={finalAmount}
            onChange={(e) => onFinalAmountChange(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
          />
        </label>
      </div>
      {courseFee && finalAmount && Number.isFinite(Number(courseFee)) && Number.isFinite(Number(finalAmount)) && (
        <p className="text-xs text-brand-muted mb-4">
          {enOnly('admin.detail.payableAmountWillBe')} ₹{Math.round(Number(courseFee) * (100 - Number(finalAmount)) / 100).toLocaleString('en-IN')}
        </p>
      )}

      <label className="block mb-4">
        <span className="block text-sm font-medium text-brand-text mb-1.5">
          {enOnly('admin.detail.trustCommitteeNotes')} {concessionCategory === 'exceptional' && <span className="text-brand-red">*</span>}
        </span>
        <textarea
          value={concessionNote}
          onChange={(e) => onConcessionNoteChange(e.target.value)}
          rows={3}
          placeholder={enOnly('admin.detail.rationalePlaceholder')}
          className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
        />
      </label>

      {concessionError && <p className="text-sm text-brand-red mb-4">{concessionError}</p>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={onSave}
          disabled={savingConcession}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {savingConcession ? enOnly('admin.detail.saving') : enOnly('admin.detail.saveConcessionDecision')}
        </button>
        {app.concessionDecidedAt && (
          <p className="text-xs text-brand-muted">
            {enOnly('admin.detail.lastRecorded')} {new Date(app.concessionDecidedAt).toLocaleString('en-IN')}
          </p>
        )}
      </div>
    </div>
  )
}
