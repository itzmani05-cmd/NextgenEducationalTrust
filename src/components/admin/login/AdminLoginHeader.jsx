import logo from '../../../assests/Logo.webp'
import { enOnly } from '../../../i18n/bilingual.js'

export default function AdminLoginHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <img src={logo} alt="" className="w-14 h-14 object-contain mb-3" />
      <h1 className="text-xl font-bold text-brand-navy">{enOnly('admin.login.heading')}</h1>
      <p className="text-sm text-brand-muted mt-1">
        {enOnly('admin.login.subtitle')}
      </p>
    </div>
  )
}
