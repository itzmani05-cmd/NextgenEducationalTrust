import { enOnly } from '../../../i18n/bilingual.js'

export default function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-border last:border-0 gap-4">
      <span className="text-sm text-brand-muted shrink-0">{label}</span>
      <span className="text-sm font-medium text-brand-text text-right">{value || enOnly('admin.common.dash')}</span>
    </div>
  )
}
