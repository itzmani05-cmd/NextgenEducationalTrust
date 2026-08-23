export default function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  helper,
  className = '',
  readOnly = false,
}) {
  return (
    <label className={`block ${className}`}>
      <span className="apply-q block text-sm font-medium text-brand-text mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        aria-readonly={readOnly}
        className={`w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-sm placeholder:text-brand-muted/60 focus:outline-none transition-colors ${
          readOnly
            ? 'bg-brand-surface text-brand-muted cursor-not-allowed'
            : 'text-brand-text focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy'
        }`}
      />
      {helper && <span className="block text-xs text-brand-muted mt-1">{helper}</span>}
    </label>
  )
}
