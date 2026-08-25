import { MapPin } from 'lucide-react'

export default function FindUsSection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-10">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Visit Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-brand-rust" />
            Find Us
          </h2>
        </div>
        <div className="flex items-start gap-3 justify-center text-center sm:text-left sm:justify-start mb-6">
          <MapPin className="w-5 h-5 text-brand-rust shrink-0 mt-0.5" />
          <p className="text-sm text-brand-muted">
            2nd Floor, Lawley Road Signal, R.S. Puram, Coimbatore, Tamil Nadu – 641002, India
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-brand-border shadow-sm">
          <iframe
            src="https://www.google.com/maps?q=C3+Educational+Platform,+Lawley+Road+Signal,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="C³ Educational Platform location"
          />
        </div>
      </div>
    </section>
  )
}
