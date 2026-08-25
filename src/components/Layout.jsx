import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'

export default function Layout() {
  useScrollReveal()

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
