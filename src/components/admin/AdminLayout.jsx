import { useState } from 'react'
import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  LayoutGrid, FileText, ShieldCheck, Calculator, Wallet, Settings, HelpCircle, LogOut, HeartHandshake,
  Menu, X,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { enOnly } from '../../i18n/bilingual.js'
import logo from '../../assests/Logo.webp'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!token) return <Navigate to="/admin/login" replace />

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-navy text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`

  return (
    <div className="min-h-screen flex bg-brand-surface">
      <Helmet>
        <title>Admin | NextGen Solutions Educational Trust</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-16 bg-brand-text text-white flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
            <img src={logo} alt="" className="w-5.5 h-5.5 object-contain" />
          </div>
          <p className="font-bold text-sm truncate">{enOnly('admin.nav.portalTitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-64 shrink-0 bg-brand-text text-white flex flex-col fixed md:sticky top-0 h-screen overflow-y-auto z-50 transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
              <img src={logo} alt="" className="w-7 h-7 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-tight truncate">{enOnly('admin.nav.portalTitle')}</p>
              <p className="text-xs text-white/50 leading-tight truncate">{enOnly('admin.nav.orgName')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClasses} onClick={() => setMobileOpen(false)}>
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-1">
          <NavLink to="/admin/support" className={navLinkClasses} onClick={() => setMobileOpen(false)}>
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

      <main className="flex-1 min-w-0 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}
