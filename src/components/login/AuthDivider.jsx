export default function AuthDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-brand-border" />
      <span className="text-xs font-medium text-brand-muted">OR</span>
      <div className="h-px flex-1 bg-brand-border" />
    </div>
  )
}
