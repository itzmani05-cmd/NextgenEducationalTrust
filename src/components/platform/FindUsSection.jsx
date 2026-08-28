import { MapPin, Navigation } from 'lucide-react'

const ADDRESS = '2nd Floor, Lawley Road Signal, R.S. Puram, Coimbatore, Tamil Nadu – 641002, India'
const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=C3+Educational+Platform,+Lawley+Road+Signal,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002'
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=C3+Educational+Platform,+Lawley+Road+Signal,+R.S.+Puram,+Coimbatore,+Tamil+Nadu+641002&output=embed'

export default function FindUsSection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted bg-white">
            Visit Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">Find Us</h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-brand-rust/10 text-brand-rust flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold tracking-[0.1em] uppercase text-brand-ink mb-2">
                Our Location
              </p>
              <p className="text-sm text-brand-muted leading-relaxed">{ADDRESS}</p>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-brand-ink text-white font-semibold text-sm py-3 rounded-lg hover:bg-black transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          </div>

          <div className="lg:col-span-3 h-[320px] lg:h-auto rounded-2xl overflow-hidden border border-brand-border shadow-sm">
            <iframe
              src={MAP_EMBED_URL}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="C³ Educational Platform location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
