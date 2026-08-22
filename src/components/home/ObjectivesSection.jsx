import {
  GraduationCap,
  Stethoscope,
  Building2,
  UtensilsCrossed,
  LifeBuoy,
  HandHeart,
  Leaf,
  Accessibility,
  HeartHandshake,
} from 'lucide-react'

const objectives = [
  {
    icon: GraduationCap,
    title: 'Education & Student Support',
    desc: 'Supporting poor, needy, and deserving students through scholarships, grants, fellowships, educational materials, skill development, and other forms of assistance.',
  },
  {
    icon: Stethoscope,
    title: 'Healthcare & Medical Support',
    desc: 'Organizing medical camps, blood donation drives, medicine distribution, eye donation awareness, and other healthcare initiatives for people in need.',
  },
  {
    icon: Building2,
    title: 'Educational & Charitable Institutions',
    desc: 'Establishing, developing, and assisting schools, colleges, hospitals, nursing institutions, dispensaries, maternity homes, and child welfare centres.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food, Shelter & Basic Needs',
    desc: 'Providing food, shelter, clothing, and essential support to poor and vulnerable people, including street dwellers and communities in difficult circumstances.',
  },
  {
    icon: LifeBuoy,
    title: 'Community Welfare & Disaster Relief',
    desc: 'Assisting people and communities affected by natural disasters and other emergencies with essential supplies, healthcare, and rehabilitation support.',
  },
  {
    icon: HandHeart,
    title: 'Rehabilitation & Social Awareness',
    desc: 'Supporting de-addiction and rehabilitation programs, and creating awareness about responsible citizenship, traffic safety, and organ donation.',
  },
  {
    icon: Leaf,
    title: 'Environmental Sustainability',
    desc: 'Promoting green and sustainable living through tree plantation, clean-up drives, and environmental awareness programs.',
  },
  {
    icon: Accessibility,
    title: 'Support for Vulnerable Communities',
    desc: 'Extending assistance to persons with disabilities, disadvantaged communities, tribal populations, and others who require humanitarian support.',
  },
  {
    icon: HeartHandshake,
    title: 'Dignity & Humanitarian Services',
    desc: 'Providing compassionate support to helpless individuals and families, including assistance with essential services during times of need.',
  },
]

export default function ObjectivesSection() {
  return (
    <section id="objectives" className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Our Objectives
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-5">
            What We Stand For
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Nine commitments that guide every initiative we undertake, together building a more
            inclusive, compassionate, and sustainable society.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {objectives.map(({ icon: Icon, title, desc }, i) => (
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
