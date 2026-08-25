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
            4/1023 D, Ayyalu Meenakshi Nagar, Udumalpet – 642 126, Tamil Nadu
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-brand-border shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125318.51229401889!2d76.85763176120761!3d11.023352455007315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8594f36886f69%3A0x99d441e392c3e41b!2sC%5E3%20_%20Civil%20engineering%20Coaching%20Centre!5e0!3m2!1sen!2sin!4v1787423532985!5m2!1sen!2sin"
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
