import { Check } from 'lucide-react'
import { enOnly } from '../../i18n/bilingual.js'

export const STEP_COUNT = 6

export default function Stepper({ current }) {
  const titles = enOnly('stepper.titles')

  return (
    <div className="mb-8 -mx-1 overflow-x-auto">
      <div className="flex items-center px-1 pb-2 min-w-max">
        {titles.map((title, i) => {
          const stepNum = i + 1
          const done = stepNum < current
          const active = stepNum === current

          return (
            <div key={title} className="flex items-center shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    done
                      ? 'bg-brand-navy text-white'
                      : active
                        ? 'bg-white border-2 border-brand-navy text-brand-navy'
                        : 'bg-brand-surface text-brand-muted'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </span>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    active ? 'text-brand-navy' : done ? 'text-brand-text' : 'text-brand-muted'
                  }`}
                >
                  {title}
                </span>
              </div>
              {stepNum !== STEP_COUNT && (
                <span
                  className={`w-6 md:w-8 h-px mx-2 shrink-0 ${done ? 'bg-brand-navy' : 'bg-brand-border'}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
