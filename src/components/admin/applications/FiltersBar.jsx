import { Search } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

const FILTERS = [
  { value: '', labelKey: 'admin.applications.filterAll' },
  { value: 'submitted', labelKey: 'admin.applications.filterSubmitted' },
  { value: 'under_review', labelKey: 'admin.applications.filterUnderReview' },
  { value: 'approved', labelKey: 'admin.applications.filterApproved' },
  { value: 'rejected', labelKey: 'admin.applications.filterRejected' },
  { value: 'payment_submitted', labelKey: 'admin.applications.filterPaymentSubmitted' },
  { value: 'payment_approved', labelKey: 'admin.applications.filterPaymentApproved' },
  { value: 'payment_rejected', labelKey: 'admin.applications.filterPaymentRejected' },
  { value: 'certificate_issued', labelKey: 'admin.applications.filterCertificateIssued' },
]

export default function FiltersBar({ statusFilter, onStatusFilterChange, search, onSearchChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onStatusFilterChange(f.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              statusFilter === f.value
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-brand-text border-brand-border hover:border-brand-navy'
            }`}
          >
            {enOnly(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={enOnly('admin.applications.searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-brand-border pl-9 pr-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
        />
      </div>
    </div>
  )
}
