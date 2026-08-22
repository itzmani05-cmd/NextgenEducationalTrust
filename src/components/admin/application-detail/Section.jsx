export default function Section({ title, children }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  )
}
