import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageSlider from '../ImageSlider.jsx'
import c3PlatformPic1 from '../../assests/c3Platform/Pic1.jpeg'
import c3PlatformPic2 from '../../assests/c3Platform/Pic2.jpeg'

export default function HeroSection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-20 md:pb-28 md:pt-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Technical Skill Development Program
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-4 leading-tight">
            <span className="text-brand-rust">C³ Educational Platform</span> 
          </h1>
          

          <p className="text-brand-muted text-lg leading-relaxed mb-6">
            C³ Educational Platform is a Technical Skill Development Program of NextGen Solutions Educational Trust
            , designed to strengthen the technical knowledge, problem-solving ability and
            examination skills of students aspiring for State and Central Government Services and
            GATE examinations.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-brand-rust text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-brand-rustDark transition-colors"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ImageSlider
          images={[c3PlatformPic1, c3PlatformPic2]}
          interval={7000}
          alt="Students at a C³ Educational Platform coaching session"
          className="rounded-2xl shadow-sm h-80 md:h-[26rem]"
          loading="eager"
        />
      </div>
    </section>
  )
}
