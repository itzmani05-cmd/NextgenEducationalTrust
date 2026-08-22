import { enOnly } from '../../i18n/bilingual.js'

export default function AdminSupport() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-2">{enOnly('admin.support.title')}</h1>
      <p className="text-brand-muted text-sm mb-8">{enOnly('admin.support.subtitle')}</p>
      <div className="bg-white border border-brand-border rounded-xl p-6">
        <p className="text-sm text-brand-text">
          {enOnly('admin.support.emailUs')}{' '}
          <a href="mailto:nextgencollegesolutions@gmail.com" className="text-brand-navy font-medium hover:underline">nextgencollegesolutions@gmail.com</a>{' '}
          {enOnly('admin.support.orCall')}{' '}
          <a href="tel:+919342379043" className="text-brand-navy font-medium hover:underline">93423 79043</a>.
        </p>
      </div>
    </div>
  )
}
