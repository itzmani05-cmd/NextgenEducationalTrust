import SEO from '../components/SEO.jsx'
import { breadcrumbSchema } from '../seo/schema.js'
import HeroSection from '../components/terms-of-service/HeroSection.jsx'
import TermsContentSection from '../components/terms-of-service/TermsContentSection.jsx'

export default function TermsOfService() {
  return (
    <div className="bg-white">
      <SEO
        title="Terms of Service | NextGen Solutions Educational Trust"
        description="Terms and conditions governing use of the NextGen Solutions Educational Trust website, scholarship applications, and the C3 Educational Platform."
        path="/terms-of-service"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms-of-service' },
        ])}
      />
      <HeroSection />
      <div data-reveal><TermsContentSection /></div>
    </div>
  )
}
