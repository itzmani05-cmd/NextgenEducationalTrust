import HeroSection from '../components/home/HeroSection.jsx'
import AboutSection from '../components/home/AboutSection.jsx'
import InitiativesSection from '../components/home/InitiativesSection.jsx'
import ObjectivesSection from '../components/home/ObjectivesSection.jsx'
import ProgramHighlightSection from '../components/home/ProgramHighlightSection.jsx'
import EventsPreviewSection from '../components/home/EventsPreviewSection.jsx'
// import ImpactStorySection from '../components/home/ImpactStorySection.jsx'
import VoicesOfImpactSection from '../components/home/VoicesOfImpactSection.jsx'
import GuidingPrinciplesSection from '../components/home/GuidingPrinciplesSection.jsx'
import GallerySection from '../components/home/GallerySection.jsx'
import ContactSection from '../components/home/ContactSection.jsx'
import CtaSection from '../components/home/CtaSection.jsx'

export default function Dashboard() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <InitiativesSection />
      <ObjectivesSection />
      <ProgramHighlightSection />
      <EventsPreviewSection />
      {/* <ImpactStorySection /> */}
      <VoicesOfImpactSection />
      <GuidingPrinciplesSection />
      <GallerySection />
      <ContactSection />
      <CtaSection />
    </div>
  )
}
