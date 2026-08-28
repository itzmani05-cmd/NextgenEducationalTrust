import { GraduationCap, HandHeart, Megaphone } from 'lucide-react'

const initiatives = [
  {
    icon: GraduationCap,
    title: 'Education',
    desc: 'Providing scholarships, resources, and access to quality education for underprivileged students to build a strong foundation for their future.',
  },
  {
    icon: HandHeart,
    title: 'Welfare',
    desc: 'Supporting community development programs, healthcare access, and essential resources for those in immediate need.',
  },
  {
    icon: Megaphone,
    title: 'Awareness',
    desc: 'Conducting workshops, seminars, and campaigns to raise awareness on social issues, health, and civil rights within the community.',
  },
]

export default function InitiativesSection() {
  return (
    <section id="initiatives" className="bg-brand-cream">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-20 md:py-28 text-center">
        <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
          Our Work
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-14">
          Initiatives &amp; Focus Areas
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {initiatives.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-brand-border rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-brand-rust/10 text-brand-rust flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-brand-ink mb-3">{title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
