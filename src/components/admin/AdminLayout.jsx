import { Outlet, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutGrid, FileText, ShieldCheck, Calculator, Wallet, Settings, HelpCircle, LogOut, HeartHandshake,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { enOnly } from '../../i18n/bilingual.js'
import logo from '../../assests/Logo.png'

const NAV_ITEMS = [
  { to: '/admin', label: enOnly('admin.nav.analytics'), icon: LayoutGrid, end: true },
  { to: '/admin/applications', label: enOnly('admin.nav.applications'), icon: FileText, end: true },
  { to: '/admin/applications?status=payment_submitted', label: enOnly('admin.nav.payments'), icon: Wallet },
  { to: '/admin/verification', label: enOnly('admin.nav.verification'), icon: ShieldCheck },
  { to: '/admin/donations', label: enOnly('admin.nav.donations'), icon: HeartHandshake },
  { to: '/admin/settings', label: enOnly('admin.nav.settings'), icon: Settings },
]

export default function AdminLayout() {
  const { token, logout } = useAdminAuth()

  if (!token) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen flex bg-brand-surface">
      <aside className="w-64 shrink-0 bg-brand-text text-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
            <img src={logo} alt="" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <p className="font-bold leading-tight">{enOnly('admin.nav.portalTitle')}</p>
            <p className="text-xs text-white/50 leading-tight">{enOnly('admin.nav.orgName')}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-navy text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-1">
          <NavLink
            to="/admin/support"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-navy text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <HelpCircle className="w-4.5 h-4.5 shrink-0" />
            {enOnly('admin.nav.support')}
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {enOnly('admin.nav.logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
