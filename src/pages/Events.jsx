import SEO from '../components/SEO.jsx'
import { breadcrumbSchema } from '../seo/schema.js'
import HeroSection from '../components/events/HeroSection.jsx'
import EventsGridSection from '../components/events/EventsGridSection.jsx'

export default function Events() {
  return (
    <div className="bg-white">
      <SEO
        title="Educational Events & Initiatives | NextGen Solutions Educational Trust"
        description="Discover NextGen Solutions Educational Trust's initiatives across education, environment, health, sports, and community welfare — from exam kit distribution to blood donation camps across Tamil Nadu."
        path="/events"
        keywords="educational events Tamil Nadu, trust activities, social initiatives, community welfare, educational trust events"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ])}
      />
      <HeroSection />
      <div data-reveal><EventsGridSection /></div>
    </div>
  )
}
