import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <img
          src="/hero/hero-1440.webp"
          srcSet="/hero/hero-640.webp 640w, /hero/hero-960.webp 960w, /hero/hero-1440.webp 1440w, /hero/hero-1920.webp 1920w"
          sizes="100vw"
          width="1920"
          height="1195"
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-ink/75" />
      </div>

      <div className="relative max-w-5xl 3xl:max-w-[1280px] 4xl:max-w-[1536px] 5xl:max-w-[1792px] 6xl:max-w-[2048px] mx-auto px-6 py-28 md:py-30 text-center text-white">
        <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-white/30 rounded-full px-4 py-1.5 mb-6">
          Empowering Generations
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight text-rustDark mb-6 text-balance">
          Building a Better Future<span className="block text-brand-rust">
              One Life at a Time.
            </span>
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
           Through education, opportunity, and compassionate service,
            we work to create meaningful and lasting change in society.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#initiatives"
            className="inline-flex items-center gap-2 bg-brand-rust text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-brand-rustDark transition-colors"
          >
            Explore Our Work <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white text-brand-ink px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Support Our Mission
          </a>
        </div>
      </div>
    </section>
  )
}
