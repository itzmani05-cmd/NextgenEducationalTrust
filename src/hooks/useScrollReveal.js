import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Mount once (in Layout) to drive every [data-reveal] element on the site.
// A single IntersectionObserver is far cheaper than one per component, and a
// MutationObserver picks up nodes added after route changes or async data
// loads (e.g. admin tables) without each page having to wire this up itself.
export default function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )

    const observeAll = () => {
      document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => observer.observe(el))
    }

    observeAll()

    const mutationObserver = new MutationObserver(observeAll)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])
}
