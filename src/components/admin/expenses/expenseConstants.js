import {
  GraduationCap, BookOpen, CalendarDays, Users, Building2, Package, Bus, Wrench, Megaphone, MoreHorizontal,
} from 'lucide-react'

export const EXPENSE_CATEGORIES = [
  { value: 'scholarship', label: 'Scholarship Disbursement', icon: GraduationCap, accent: 'text-brand-navy bg-blue-50' },
  { value: 'education_materials', label: 'Books & Education Materials', icon: BookOpen, accent: 'text-indigo-700 bg-indigo-50' },
  { value: 'events', label: 'Events & Programs', icon: CalendarDays, accent: 'text-purple-700 bg-purple-50' },
  { value: 'salaries', label: 'Salaries & Honorarium', icon: Users, accent: 'text-teal-700 bg-teal-50' },
  { value: 'rent_utilities', label: 'Rent & Utilities', icon: Building2, accent: 'text-sky-700 bg-sky-50' },
  { value: 'office_supplies', label: 'Office Supplies', icon: Package, accent: 'text-amber-700 bg-amber-50' },
  { value: 'travel', label: 'Travel & Transport', icon: Bus, accent: 'text-orange-700 bg-orange-50' },
  { value: 'maintenance', label: 'Repairs & Maintenance', icon: Wrench, accent: 'text-stone-700 bg-stone-100' },
  { value: 'marketing', label: 'Outreach & Marketing', icon: Megaphone, accent: 'text-pink-700 bg-pink-50' },
  { value: 'other', label: 'Other', icon: MoreHorizontal, accent: 'text-brand-muted bg-brand-surface' },
]

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Card' },
]

export function getCategory(value) {
  return EXPENSE_CATEGORIES.find((c) => c.value === value) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}

export function getPaymentModeLabel(value) {
  return PAYMENT_MODES.find((m) => m.value === value)?.label || value
}

export function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

// Placeholder rows so the UI can be reviewed before the backend exists.
export const SAMPLE_EXPENSES = [
  { id: 'e1', title: 'Semester fee — 12 students', category: 'scholarship', amount: 186000, date: '2026-09-24', paymentMode: 'bank_transfer', paidTo: 'Anna University', referenceNo: 'NEFT88213409', notes: 'Odd semester 2026 batch' },
  { id: 'e2', title: 'Textbooks for Class 10 students', category: 'education_materials', amount: 14250, date: '2026-09-18', paymentMode: 'upi', paidTo: 'Higginbothams', referenceNo: 'UPI4521907733', notes: '' },
  { id: 'e3', title: 'Office rent — September', category: 'rent_utilities', amount: 18000, date: '2026-09-05', paymentMode: 'bank_transfer', paidTo: 'R. Srinivasan', referenceNo: 'NEFT88190021', notes: '' },
  { id: 'e4', title: 'Career guidance workshop', category: 'events', amount: 9800, date: '2026-09-02', paymentMode: 'cash', paidTo: 'Hall booking & refreshments', referenceNo: '', notes: '65 attendees' },
  { id: 'e5', title: 'Coordinator honorarium', category: 'salaries', amount: 12000, date: '2026-08-31', paymentMode: 'bank_transfer', paidTo: 'S. Priya', referenceNo: 'NEFT87990450', notes: 'August' },
  { id: 'e6', title: 'Printer cartridges & paper', category: 'office_supplies', amount: 3450, date: '2026-08-22', paymentMode: 'card', paidTo: 'Staples', referenceNo: '', notes: '' },
  { id: 'e7', title: 'Field visit — Madurai schools', category: 'travel', amount: 5600, date: '2026-08-14', paymentMode: 'upi', paidTo: 'Travels', referenceNo: 'UPI4498012210', notes: '' },
]
