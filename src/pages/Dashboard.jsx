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
      <div data-reveal><AboutSection /></div>
      <div data-reveal><InitiativesSection /></div>
      <div data-reveal><ObjectivesSection /></div>
      <div data-reveal><ProgramHighlightSection /></div>
      <div data-reveal><EventsPreviewSection /></div>
      {/* <ImpactStorySection /> */}
      <div data-reveal><VoicesOfImpactSection /></div>
      <div data-reveal><GuidingPrinciplesSection /></div>
      <div data-reveal><GallerySection /></div>
      <div data-reveal><ContactSection /></div>
      <div data-reveal><CtaSection /></div>
    </div>
  )
}
