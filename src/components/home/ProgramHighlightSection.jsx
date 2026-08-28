import ImageSlider from '../ImageSlider.jsx'
import c3PlatformPic1 from '../../assests/c3Platform/Pic1.jpeg'
import c3PlatformPic2 from '../../assests/c3Platform/Pic2.jpeg'

export default function ProgramHighlightSection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-20 md:py-28">
        <div className="bg-brand-ink rounded-3xl overflow-hidden grid md:grid-cols-2">
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-rust/50 text-brand-rust rounded-full px-4 py-1.5 mb-6 self-start">
              Program Highlight
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight">
              The Scholarship Program
            </h2>
            <p className="text-white/70 leading-relaxed mb-8 max-w-md">
              Unlocking doors for brilliant minds. We provide full financial support to deserving
              students pursuing higher education, ensuring that talent never goes unsupported due
              to economic constraints.
            </p>
            <a
              href="/apply"
              className="inline-flex items-center gap-2 bg-brand-rust text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-brand-rustDark transition-colors self-start"
            >
              Apply for Scholarship
            </a>
          </div>

          <ImageSlider
            images={[c3PlatformPic1, c3PlatformPic2]}
            interval={7000}
            alt="Students at a C3 Educational Platform classroom session"
            className="h-64 md:h-auto"
          />
        </div>
      </div>
    </section>
  )
}
