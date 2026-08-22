import { BookOpen, GraduationCap, BarChart3, ClipboardCheck } from 'lucide-react'

const focusAreas = [
  {
    icon: BookOpen,
    title: 'Technical Subject Mastery',
    desc: 'Strong conceptual understanding of core engineering subjects and their practical applications.',
  },
  {
    icon: GraduationCap,
    title: 'Competitive Examination Preparation',
    desc: 'Structured preparation aligned with the technical requirements of State and Central Government Service Examinations and GATE.',
  },
  {
    icon: BarChart3,
    title: 'Problem-Solving & Application Skills',
    desc: 'Developing the ability to analyse engineering problems and apply appropriate concepts, formulas and methods.',
  },
  {
    icon: ClipboardCheck,
    title: 'Practice & Assessment',
    desc: 'Regular practice, previous-year question analysis, mock examinations and performance-based assessments.',
  },
]

export default function FocusSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-20 md:py-28">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-ink text-center mb-14">
          Our Focus
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          {focusAreas.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="border border-brand-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-brand-rust/10 text-brand-rust flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-brand-rust tracking-wide">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-serif text-lg text-brand-ink mb-2">{title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
