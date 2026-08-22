import { useState } from 'react'
import { MapPin, Mail, Phone, UserRound } from 'lucide-react'

const initialForm = { firstName: '', lastName: '', email: '', message: '' }

export default function ContactSection() {
  const [form, setForm] = useState(initialForm)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm(initialForm)
  }

  return (
    <section id="contact" className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Get Involved
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-6">Get In Touch</h2>
          <p className="text-brand-muted text-lg leading-relaxed mb-10 max-w-md">
            We invite you to collaborate, support, or learn more about our initiatives. Reach out
            to us directly.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-rust shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold tracking-[0.1em] uppercase text-brand-ink mb-1">
                  Call Us
                </p>
                <p className="text-sm text-brand-muted">93423 79043 / 97902 13628</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-rust shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold tracking-[0.1em] uppercase text-brand-ink mb-1">
                  Email Us
                </p>
                <p className="text-sm text-brand-muted">nextgencollegesolutions@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-rust shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold tracking-[0.1em] uppercase text-brand-ink mb-1">
                  Office Address
                </p>
                <p className="text-sm text-brand-muted">
                  4/1023 D, Ayyalu Meenakshi Nagar,
                  <br />
                  Udumalpet – 642 126, Tamil Nadu
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-brand-cream rounded-2xl p-8 md:p-10 border border-brand-border"
        >
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <label className="block">
              <span className="block text-sm font-semibold text-brand-ink mb-1.5">First Name</span>
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rust/30 focus:border-brand-rust transition-colors"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-brand-ink mb-1.5">Last Name</span>
              <input
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rust/30 focus:border-brand-rust transition-colors"
              />
            </label>
          </div>

          <label className="block mb-5">
            <span className="block text-sm font-semibold text-brand-ink mb-1.5">Email Address</span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rust/30 focus:border-brand-rust transition-colors"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-sm font-semibold text-brand-ink mb-1.5">Message</span>
            <textarea
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              className="w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rust/30 focus:border-brand-rust transition-colors resize-none"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-brand-ink text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-black transition-colors"
          >
            Send Message
          </button>
          {sent && (
            <p className="text-sm text-emerald-700 mt-3 text-center">
              Thank you — we&apos;ll be in touch shortly.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
