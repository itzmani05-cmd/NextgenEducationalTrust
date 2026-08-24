import { Search, FileSearch } from 'lucide-react'

export default function StatusLookupForm({ mobile, setMobile, email, setEmail, loading, error, onSubmit }) {
  return (
    <>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-white shadow-sm text-brand-navy flex items-center justify-center mx-auto mb-4">
          <FileSearch className="w-6 h-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
          Check Application Status
        </h1>
        <p className="text-brand-muted text-sm">
          Enter the mobile number and email you applied with.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="block text-sm font-medium text-brand-text mb-1.5">Mobile Number</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-brand-text mb-1.5">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
            />
          </label>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-brand-red/30 rounded-lg p-3 text-sm text-brand-red">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !mobile || !email}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching…' : 'Check Status'}
        </button>
      </form>
    </>
  )
}
