import { Landmark, Building2, GraduationCap } from 'lucide-react'

const programs = [
  {
    icon: Landmark,
    title: 'State Government Service Examinations',
    desc: 'Technical preparation for engineering recruitment examinations conducted by State Government agencies.',
  },
  {
    icon: Building2,
    title: 'Central Government Service Examinations',
    desc: 'Technical preparation for relevant Central Government engineering recruitment examinations.',
  },
  {
    icon: GraduationCap,
    title: 'GATE Preparation',
    desc: 'Comprehensive technical preparation focused on conceptual clarity, numerical problem-solving, previous-year questions and examination strategy.',
  },
]

export default function ProgramsSection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-20 md:py-28 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-14">
          Programs Offered
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {programs.map(({ icon: Icon, title, desc }) => (
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
