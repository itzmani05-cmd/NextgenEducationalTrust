import { IndianRupee, CalendarRange, Receipt, PieChart } from 'lucide-react'
import { formatINR, resolveCategory } from './expenseConstants.js'

export default function ExpenseSummaryCards({ expenses, categoriesById, loading }) {
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const thisMonth = expenses
    .filter((e) => e.date.startsWith(monthKey))
    .reduce((sum, e) => sum + e.amount, 0)

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.categoryId] = (acc[e.categoryId] || 0) + e.amount
    return acc
  }, {})
  const topEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

  const cards = [
    { label: 'Total Spent', value: formatINR(total), icon: IndianRupee, accent: 'text-brand-red bg-red-50' },
    { label: 'This Month', value: formatINR(thisMonth), icon: CalendarRange, accent: 'text-brand-navy bg-blue-50' },
    { label: 'Entries', value: expenses.length, icon: Receipt, accent: 'text-teal-700 bg-teal-50' },
    {
      label: 'Top Category',
      value: topEntry ? resolveCategory(categoriesById, topEntry[0]).name : '—',
      sub: topEntry ? formatINR(topEntry[1]) : '',
      icon: PieChart,
      accent: 'text-brand-amber bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, sub, icon: Icon, accent }) => (
        <div key={label} className="bg-white border border-brand-border rounded-xl p-5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <p className="text-xl font-bold text-brand-text truncate" title={String(value)}>{loading ? '—' : value}</p>
          <p className="text-xs text-brand-muted mt-0.5">
            {label}
            {sub && !loading && <span className="text-brand-text font-medium"> · {sub}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}
