export default function AuthField({ icon: Icon, label, type = 'text', value, onChange, required = false }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-brand-text mb-1.5">{label}</span>
      <div className="relative">
        <Icon className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-brand-border pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
        />
      </div>
    </label>
  )
}
