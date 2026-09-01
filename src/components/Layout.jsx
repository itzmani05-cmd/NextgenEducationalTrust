import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import { organizationSchema, websiteSchema } from '../seo/schema.js'

// Organization + WebSite JSON-LD describe the Trust itself, not any one
// page, so they're emitted once here for every public route rather than
// repeated (or risking drift) in each page's own SEO component.
export default function Layout() {
  useScrollReveal()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema())}</script>
      </Helmet>
      <ScrollToTop />
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
