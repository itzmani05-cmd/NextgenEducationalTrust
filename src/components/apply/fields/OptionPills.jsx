export default function OptionPills({ label, value, onChange, options, required }) {
  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-brand-text mb-2">
          {label} {required && <span className="text-brand-red">*</span>}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                active
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-text border-brand-border hover:border-brand-navy'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
