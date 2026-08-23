import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function DonationThankYou({ data }) {
  return (
    <section className="bg-white">
      <div className="max-w-2xl mx-auto px-6 py-28 md:py-36 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-rust/10 text-brand-rust mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-brand-ink mb-5">Thank You, {data.fullName}!</h1>
        <p className="text-brand-muted text-lg leading-relaxed mb-2">
          We&apos;ve received your donation details for{' '}
          <span className="font-semibold text-brand-ink">₹{data.amount}</span> towards{' '}
          <span className="font-semibold text-brand-ink">{data.purpose}</span>.
        </p>
        <p className="text-brand-muted text-lg leading-relaxed mb-10">
          Our team will verify the transaction and send a donation receipt to {data.email} once
          it&apos;s confirmed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-rust text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-brand-rustDark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}
