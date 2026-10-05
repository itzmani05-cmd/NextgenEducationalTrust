import {
  GraduationCap, BookOpen, CalendarDays, Users, Building2, Package, Bus, Wrench, Megaphone, HeartPulse,
  Utensils, Laptop, MoreHorizontal,
} from 'lucide-react'

export const CATEGORY_ICONS = [
  { key: 'scholarship', icon: GraduationCap, accent: 'text-brand-navy bg-blue-50' },
  { key: 'education_materials', icon: BookOpen, accent: 'text-indigo-700 bg-indigo-50' },
  { key: 'events', icon: CalendarDays, accent: 'text-purple-700 bg-purple-50' },
  { key: 'salaries', icon: Users, accent: 'text-teal-700 bg-teal-50' },
  { key: 'rent_utilities', icon: Building2, accent: 'text-sky-700 bg-sky-50' },
  { key: 'office_supplies', icon: Package, accent: 'text-amber-700 bg-amber-50' },
  { key: 'travel', icon: Bus, accent: 'text-orange-700 bg-orange-50' },
  { key: 'maintenance', icon: Wrench, accent: 'text-stone-700 bg-stone-100' },
  { key: 'marketing', icon: Megaphone, accent: 'text-pink-700 bg-pink-50' },
  { key: 'health', icon: HeartPulse, accent: 'text-rose-700 bg-rose-50' },
  { key: 'food', icon: Utensils, accent: 'text-lime-700 bg-lime-50' },
  { key: 'technology', icon: Laptop, accent: 'text-cyan-700 bg-cyan-50' },
  { key: 'other', icon: MoreHorizontal, accent: 'text-brand-muted bg-brand-surface' },
]

export function getIconStyle(key) {
  return CATEGORY_ICONS.find((i) => i.key === key) || CATEGORY_ICONS[CATEGORY_ICONS.length - 1]
}

export function resolveCategory(categoriesById, id) {
  const category = categoriesById[id]
  return { name: category?.name || 'Uncategorised', ...getIconStyle(category?.icon) }
}

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Card' },
]

export function getPaymentModeLabel(value) {
  return PAYMENT_MODES.find((m) => m.value === value)?.label || value
}

export function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

export function formatExpenseDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
