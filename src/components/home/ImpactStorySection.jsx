import { ArrowRight } from 'lucide-react'

export default function ImpactStorySection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Impact Story
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-6 leading-tight">
            &ldquo;Education changed the trajectory of my family.&rdquo;
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed mb-8">
            Read about Anjali&apos;s journey from a remote village with limited resources to
            becoming the first medical graduate in her district, supported entirely by the
            Trust&apos;s scholarship.
          </p>
          <a
            href="#objectives"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-brand-rust hover:text-brand-rustDark transition-colors"
          >
            Read Anjali&apos;s Story <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80"
            alt="Young woman smiling, graduate of the scholarship program"
            className="w-full h-[420px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
