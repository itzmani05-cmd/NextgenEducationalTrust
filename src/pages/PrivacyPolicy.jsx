import SEO from '../components/SEO.jsx'
import { breadcrumbSchema } from '../seo/schema.js'
import HeroSection from '../components/privacy-policy/HeroSection.jsx'
import PolicyContentSection from '../components/privacy-policy/PolicyContentSection.jsx'

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      <SEO
        title="Privacy Policy | NextGen Solutions Educational Trust"
        description="Read how NextGen Solutions Educational Trust collects, uses, and protects the personal and financial information submitted through scholarship applications and donations."
        path="/privacy-policy"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy' },
        ])}
      />
      <HeroSection />
      <div data-reveal><PolicyContentSection /></div>
    </div>
  )
}
