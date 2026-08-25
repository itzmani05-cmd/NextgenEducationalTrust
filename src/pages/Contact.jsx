import ContactSection from '../components/home/ContactSection.jsx'

export default function Contact() {
  return (
    <div className="bg-white">
      <section className="bg-brand-surface">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">Contact Us</h1>
          <p className="text-brand-muted">
            Questions about scholarships, the C3 Educational Platform, or anything else? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      <div data-reveal><ContactSection /></div>
    </div>
  )
}
