import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Route changes don't reset scroll position on their own, so without this a
// footer link clicked from partway down a page lands on the new page still
// scrolled down. Runs on every path change and smooth-scrolls back to top.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}
