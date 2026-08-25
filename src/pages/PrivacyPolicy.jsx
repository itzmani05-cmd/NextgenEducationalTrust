import HeroSection from '../components/privacy-policy/HeroSection.jsx'
import PolicyContentSection from '../components/privacy-policy/PolicyContentSection.jsx'

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      <HeroSection />
      <div data-reveal><PolicyContentSection /></div>
    </div>
  )
}
