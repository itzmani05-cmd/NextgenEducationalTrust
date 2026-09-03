import { HeartHandshake } from 'lucide-react'

export default function DonationHero() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <img
          src="/hero/donation-hero.webp"
          alt=""
          width="1600"
          height="1067"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-ink/75" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-24 md:py-28 text-center text-white">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase border border-white/30 rounded-full px-4 py-1.5 mb-6">
          <HeartHandshake className="w-3.5 h-3.5" /> Make a Difference
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-6 text-balance">
          Support Our <span className="text-brand-rust">Mission</span>
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">
          Your contribution helps us provide scholarships and educational opportunities to
          deserving students. Scan the QR code below or pay via UPI, then share your details so
          we can acknowledge your support.
        </p>
      </div>
    </section>
  )
}
