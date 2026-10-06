import logo from '../../../assests/Logo.webp'
import { enOnly } from '../../../i18n/bilingual.js'

export default function AdminLoginHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-7">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-surface ring-1 ring-brand-border mb-4">
        <img src={logo} alt="" className="w-11 h-11 object-contain" />
      </div>
      <h1 className="text-2xl font-bold text-brand-navy tracking-tight">{enOnly('admin.login.heading')}</h1>
      <p className="text-sm text-brand-muted mt-1.5">{enOnly('admin.login.subtitle')}</p>
    </div>
  )
}
