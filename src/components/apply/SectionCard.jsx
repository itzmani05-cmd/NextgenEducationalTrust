export default function SectionCard({ title, description, action, children }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm">
      {(title || action) && (
        <div className="mb-5 pb-4 border-b border-brand-border flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-bold text-brand-text">{title}</h3>}
            {description && <p className="text-sm text-brand-muted mt-1">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </div>
  )
}
