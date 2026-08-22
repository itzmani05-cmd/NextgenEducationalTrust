import { BadgeCheck } from 'lucide-react'

export default function Callout({ title, subtitle }) {
  return (
    <div className="flex items-center gap-3 bg-brand-surface border border-brand-navy/20 rounded-lg p-4">
      <BadgeCheck className="w-5 h-5 text-brand-navy shrink-0" />
      <div>
        <p className="text-sm font-semibold text-brand-navy">{title}</p>
        {subtitle && <p className="text-xs text-brand-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
