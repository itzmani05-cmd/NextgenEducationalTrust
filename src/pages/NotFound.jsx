import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-ink/80" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-28 md:py-36 text-center text-white">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase border border-white/30 rounded-full px-4 py-1.5 mb-8">
          <Compass className="w-3.5 h-3.5" /> Lost Your Way?
        </span>
        <h1 className="font-serif text-6xl sm:text-7xl leading-none mb-6 text-balance">
          4<span className="text-brand-rust">0</span>4
        </h1>
        <p className="text-white/80 text-lg max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s
          get you back on track.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-rust text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-brand-rustDark transition-colors"
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-brand-ink px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
