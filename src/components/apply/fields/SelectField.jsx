export default function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = 'Select...',
  className = '',
}) {
  return (
    <label className={`block ${className}`}>
      <span className="apply-q block text-sm font-medium text-brand-text mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
