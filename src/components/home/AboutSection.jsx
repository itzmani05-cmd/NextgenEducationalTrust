import { ArrowRight } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            About Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-6 leading-tight">
            A Legacy of Service and Compassion.
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed mb-8">
            Founded with a steadfast commitment to humanity, the Trust operates on the belief that
            every life holds immense potential. For over a decade, we have partnered with
            marginalized communities to break the cycle of poverty through focused interventions in
            education and holistic welfare.
          </p>
          <a
            href="#objectives"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-brand-rust hover:text-brand-rustDark transition-colors"
          >
            Read Our Story <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80"
            alt="Volunteers teaching children in a community classroom"
            className="w-full h-[420px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
