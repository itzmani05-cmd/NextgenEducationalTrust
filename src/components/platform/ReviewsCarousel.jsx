import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReviewCard from './ReviewCard.jsx'

export default function ReviewsCarousel({ items }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [items.length])

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length)
  const goNext = () => setIndex((i) => (i + 1) % items.length)

  return (
    <div className="relative max-w-2xl mx-auto">
      <ReviewCard {...items[index]} />

      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous review"
        className="absolute top-1/2 left-0 sm:-left-14 -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center text-brand-ink hover:bg-brand-cream transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next review"
        className="absolute top-1/2 right-0 sm:-right-14 -translate-y-1/2 translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center text-brand-ink hover:bg-brand-cream transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-8">
        {items.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to ${r.name}'s review`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-brand-rust' : 'w-1.5 bg-brand-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
