import SEO from '../components/SEO.jsx'
import { breadcrumbSchema, faqPageSchema } from '../seo/schema.js'
import HeroSection from '../components/faq/HeroSection.jsx'
import FaqCategoriesSection, { categories } from '../components/faq/FaqCategoriesSection.jsx'

export default function Faq() {
  return (
    <div className="bg-white">
      <SEO
        title="Frequently Asked Questions | NextGen Solutions Educational Trust"
        description="Answers to common questions about NextGen Solutions Educational Trust's scholarships, income verification, the C3 Educational Platform, and how to check your application status."
        path="/faq"
        keywords="scholarship FAQ, educational trust FAQ, C3 Educational Platform questions"
        jsonLd={[
          faqPageSchema(categories),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
        ]}
      />
      <HeroSection />
      <div data-reveal><FaqCategoriesSection /></div>
    </div>
  )
}
