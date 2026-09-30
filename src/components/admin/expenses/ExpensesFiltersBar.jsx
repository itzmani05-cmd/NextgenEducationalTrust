import { Search } from 'lucide-react'
import { EXPENSE_CATEGORIES } from './expenseConstants.js'

const inputClasses =
  'rounded-lg border border-brand-border bg-white px-3 py-2 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy'

export default function ExpensesFiltersBar({ category, onCategoryChange, month, onMonthChange, search, onSearchChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={`${inputClasses} w-full sm:w-60`}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className={`${inputClasses} w-full sm:w-44`}
          aria-label="Filter by month"
        />
        {(category || month) && (
          <button
            type="button"
            onClick={() => {
              onCategoryChange('')
              onMonthChange('')
            }}
            className="text-sm font-semibold text-brand-navy hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search expense, payee, ref no…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${inputClasses} w-full pl-9`}
        />
      </div>
    </div>
  )
}
