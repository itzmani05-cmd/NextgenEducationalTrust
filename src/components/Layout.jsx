import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import { organizationSchema, websiteSchema } from '../seo/schema.js'

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
