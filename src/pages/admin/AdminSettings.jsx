import { enOnly } from '../../i18n/bilingual.js'

export default function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-2">{enOnly('admin.settings.title')}</h1>
      <p className="text-brand-muted text-sm mb-8">{enOnly('admin.settings.subtitle')}</p>
      <div className="bg-white border border-brand-border rounded-xl p-10 text-center text-brand-muted">
        {enOnly('admin.settings.comingSoon')}
      </div>
    </div>
  )
}
