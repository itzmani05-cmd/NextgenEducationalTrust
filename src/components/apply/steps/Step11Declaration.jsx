import SectionCard from '../SectionCard.jsx'
import { bi } from '../../../i18n/bilingual.js'

export default function Step11Declaration({ data, setField }) {
  return (
    <SectionCard title={bi('step7.title')}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.declarationAccepted}
          onChange={(e) => setField('declarationAccepted', e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-brand-border text-brand-navy focus:ring-brand-navy shrink-0"
        />
        <span className="text-sm text-brand-text">{bi('step7.declarationText')}</span>
      </label>
    </SectionCard>
  )
}
