import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="bg-brand-surface">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-brand-muted">
          Answers to the questions we hear most. Can&apos;t find what you&apos;re looking for?{' '}
          <Link to="/contact" className="text-brand-red font-medium hover:underline">
            Contact us
          </Link>{' '}
          directly.
        </p>
      </div>
    </section>
  )
}
