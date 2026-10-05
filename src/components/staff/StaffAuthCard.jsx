import { Helmet } from 'react-helmet-async'
import logo from '../../assests/Logo.webp'

export const staffInputClasses =
  'w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-base sm:text-sm text-brand-text placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors'

export function StaffAuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-6 py-10">
      <Helmet>
        <title>{title} | NextGen Solutions Educational Trust</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-full max-w-sm bg-white border border-brand-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center mb-3">
            <img src={logo} alt="" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-brand-navy">{title}</h1>
          <p className="text-sm text-brand-muted mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
