export default function Section({ title, right, children }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide">{title}</h3>
        {right}
      </div>
      <div>{children}</div>
    </div>
  )
}
