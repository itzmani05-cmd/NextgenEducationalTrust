export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="mb-6 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">
      {message}
    </div>
  )
}
