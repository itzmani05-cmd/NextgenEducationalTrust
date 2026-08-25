import HeroSection from '../components/events/HeroSection.jsx'
import EventsGridSection from '../components/events/EventsGridSection.jsx'

export default function Events() {
  return (
    <div className="bg-white">
      <HeroSection />
      <div data-reveal><EventsGridSection /></div>
    </div>
  )
}
