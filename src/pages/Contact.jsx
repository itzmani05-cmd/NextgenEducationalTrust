import SEO from '../components/SEO.jsx'
import { breadcrumbSchema, contactPageSchema } from '../seo/schema.js'
import ContactSection from '../components/home/ContactSection.jsx'

export default function Contact() {
  return (
    <div className="bg-white">
      <SEO
        title="Contact NextGen Solutions Educational Trust | Tamil Nadu"
        description="Get in touch with NextGen Solutions Educational Trust for questions about scholarships, fee concessions, or the C3 Educational Platform. Call, email, or visit our office in Udumalpet, Tamil Nadu."
        path="/contact"
        keywords="contact NextGen Educational Trust, educational trust Tamil Nadu contact, scholarship enquiries"
        jsonLd={[
          contactPageSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
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
