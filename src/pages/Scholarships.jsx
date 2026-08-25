import HeroSection from '../components/platform/HeroSection.jsx'
import FocusSection from '../components/platform/FocusSection.jsx'
import ProgramsSection from '../components/platform/ProgramsSection.jsx'
import ObjectiveSection from '../components/platform/ObjectiveSection.jsx'
import ReviewsSection from '../components/platform/ReviewsSection.jsx'
import FindUsSection from '../components/platform/FindUsSection.jsx'

export default function Scholarships() {
  return (
    <div>
      <HeroSection />
      <div data-reveal><FocusSection /></div>
      <div data-reveal><ProgramsSection /></div>
      <div data-reveal><ObjectiveSection /></div>
      <div data-reveal><ReviewsSection /></div>
      <div data-reveal><FindUsSection /></div>
    </div>
  )
}
