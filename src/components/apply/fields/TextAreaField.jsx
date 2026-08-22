export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
  className = '',
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-brand-text mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-colors resize-none"
      />
    </label>
  )
}
