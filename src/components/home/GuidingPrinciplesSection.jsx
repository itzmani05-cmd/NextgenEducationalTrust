import { Target, Eye } from 'lucide-react'

const principles = [
  {
    icon: Target,
    accent: 'rust',
    label: 'Our Mission',
    text: 'Guiding the aspirations of the younger generation through financial scholarships for education, skill-building programs, sports, and extracurricular activities, while also offering community health initiatives, social welfare support, environmental projects, and relief services to the community.',
  },
  {
    icon: Eye,
    accent: 'navy',
    label: 'Our Vision',
    text: 'To create a generation of educated, skilled, and socially responsible citizens who contribute to the progress of the nation and well-being of society.',
  },
]

const ACCENT_CLASSES = {
  rust: { icon: 'bg-brand-rust/10 text-brand-rust', label: 'text-brand-rust' },
  navy: { icon: 'bg-brand-navy/10 text-brand-navy', label: 'text-brand-navy' },
}

export default function GuidingPrinciplesSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Why We Exist
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">Guiding Principles</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {principles.map(({ icon: Icon, accent, label, text }) => (
            <div
              key={label}
              className="border border-brand-border rounded-2xl p-8 md:p-10 hover:border-brand-border hover:shadow-lg hover:shadow-brand-ink/5 transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${ACCENT_CLASSES[accent].icon}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-4 ${ACCENT_CLASSES[accent].label}`}>
                {label}
              </p>
              <p className="font-serif text-lg md:text-xl text-brand-ink leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
