export default function HeroSection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
          Community Impact
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-5">
          Upcoming &amp; Past Events
        </h1>
        <p className="text-brand-muted text-lg max-w-2xl mx-auto">
          Join us in our mission to empower communities. Discover our upcoming initiatives,
          participate in awareness drives, and explore the impact of our past events.
        </p>
      </div>
    </section>
  )
}
