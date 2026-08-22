export default function GuidingPrinciplesSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Why We Exist
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-ink">Guiding Principles</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="border-t border-brand-border pt-6">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-muted mb-4">
              Our Mission
            </p>
            <p className="font-serif text-md md:text-xl text-brand-ink leading-snug">
              Guiding the aspirations of the younger generation through financial 
              scholarships for education, skill-building programs, sports, and extracurricular 
              activities, while also offering community health initiatives, social welfare 
              support, environmental projects, and relief services to the community.
            </p>
          </div>
          <div className="border-t border-brand-border pt-6">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-muted mb-4">
              Our Vision
            </p>
            <p className="font-serif text-md md:text-xl text-brand-ink leading-snug">
              To create a generation of educated, skilled, and socially responsible citizens who contribute to the progress of the nation and well-being of society.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
