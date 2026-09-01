import SEO from '../components/SEO.jsx'
import { breadcrumbSchema } from '../seo/schema.js'
import HeroSection from '../components/platform/HeroSection.jsx'
import FocusSection from '../components/platform/FocusSection.jsx'
import ProgramsSection from '../components/platform/ProgramsSection.jsx'
import ObjectiveSection from '../components/platform/ObjectiveSection.jsx'
import ReviewsSection from '../components/platform/ReviewsSection.jsx'
import FindUsSection from '../components/platform/FindUsSection.jsx'

export default function Scholarships() {
  return (
    <div>
      <SEO
        title="C3 Educational Platform | Scholarships & Skill Development | NextGen Solutions Educational Trust"
        description="Explore the C3 Educational Platform, NextGen Solutions Educational Trust's technical skill development program for students preparing for GATE and State/Central Government Service exams, backed by scholarships and fee concessions."
        path="/platform"
        keywords="scholarships Tamil Nadu, C3 Educational Platform, GATE coaching, government exam coaching, educational programs, student development programs"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'C3 Educational Platform', path: '/platform' },
        ])}
      />
      <HeroSection />
      <div data-reveal><ObjectiveSection /></div>
      <div data-reveal><FocusSection /></div>
      <div data-reveal><ProgramsSection /></div>
      
      <div data-reveal><ReviewsSection /></div>
      <div data-reveal><FindUsSection /></div>
    </div>
  )
}
