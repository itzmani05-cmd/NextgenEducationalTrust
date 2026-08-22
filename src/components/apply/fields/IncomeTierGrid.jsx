import { bi } from '../../../i18n/bilingual.js'

export default function IncomeTierGrid({ value, onChange }) {
  const tiers = [
    { value: 'upto_1_5', label: bi('step2.incomeTier1') },
    { value: '1_5_to_3', label: bi('step2.incomeTier2') },
    { value: '3_to_5', label: bi('step2.incomeTier3') },
    { value: 'above_5', label: bi('step2.incomeTier4') },
  ]

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {tiers.map((tier) => {
        const active = value === tier.value
        return (
          <button
            type="button"
            key={tier.value}
            onClick={() => onChange(tier.value)}
            className={`text-left rounded-xl border p-5 transition-colors ${
              active
                ? 'border-brand-navy ring-2 ring-brand-navy/20'
                : 'border-brand-border hover:border-brand-navy/50'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-brand-text">{tier.label}</span>
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  active ? 'border-brand-navy' : 'border-brand-border'
                }`}
              >
                {active && <span className="w-2 h-2 rounded-full bg-brand-navy" />}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
