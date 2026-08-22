export default function CtaSection() {
  return (
    <section className="bg-brand-ink">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-5">
          Join Us in Making a Difference
        </h2>
        <p className="text-white/70 text-lg mb-10">
          Your contribution, big or small, helps us bring lasting change to communities that need
          it the most.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-brand-rust text-white px-7 py-4 rounded-lg text-sm font-semibold hover:bg-brand-rustDark transition-colors"
        >
          Support Our Mission Today
        </a>
      </div>
    </section>
  )
}
