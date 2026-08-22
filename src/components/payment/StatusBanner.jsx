export default function StatusBanner({ tone, icon: Icon, title, desc }) {
  const styles = tone === 'green'
    ? { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', iconText: 'text-green-700' }
    : { bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', iconText: 'text-brand-amber' }

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-2xl p-6 flex items-center gap-4 mb-6`}>
      <div className={`w-11 h-11 rounded-full ${styles.iconBg} ${styles.iconText} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-brand-text">{title}</h1>
        <p className="text-sm text-brand-muted">{desc}</p>
      </div>
    </div>
  )
}
