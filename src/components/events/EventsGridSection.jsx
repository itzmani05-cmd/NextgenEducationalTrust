import { GraduationCap, Leaf, Stethoscope, LifeBuoy, HeartHandshake, Trophy } from 'lucide-react'
import ImageSlider from '../ImageSlider.jsx'
import edu1 from '../../assests/events/education/edu1.jpeg'
import edu2 from '../../assests/events/education/edu2.jpeg'
import env1 from '../../assests/events/environment/env1.jpeg'
import env2 from '../../assests/events/environment/env2.jpeg'
import env3 from '../../assests/events/environment/env3.jpeg'
import env4 from '../../assests/events/environment/env4.jpeg'
import hm1 from '../../assests/events/health&medical/hm1.jpeg'
import hm2 from '../../assests/events/health&medical/hm2.jpeg'
import hm3 from '../../assests/events/health&medical/hm3.jpeg'
import nd1 from '../../assests/events/naturaldisaster/nd1.jpeg'
import nd2 from '../../assests/events/naturaldisaster/nd2.jpeg'
import ooh1 from '../../assests/events/orphonage&oldhome/ooh1.jpeg'
import ooh2 from '../../assests/events/orphonage&oldhome/ooh2.jpeg'
import ooh3 from '../../assests/events/orphonage&oldhome/ooh3.jpeg'
import se1 from '../../assests/events/sports&events/se1.jpeg'
import se2 from '../../assests/events/sports&events/se2.jpeg'

const events = [
  {
    category: 'Education',
    icon: GraduationCap,
    title: 'Exam Kit Distribution for Government School Students',
    desc: 'Providing essential exam kits to government school students, helping them prepare for their examinations with confidence and the resources they need.',
    images: [edu2],
  },
  {
    category: 'Education',
    icon: GraduationCap,
    title: 'Library Book Donation Drive',
    desc: 'Donating educational and reference books to government schools to strengthen their libraries and encourage students to develop a lasting habit of reading.',
    images: [edu1],
  },
  {
    category: 'Environment',
    icon: Leaf,
    title: 'Community Tree Plantation Drive',
    desc: 'Conducting tree plantation activities across villages and public parks to promote environmental awareness and contribute to greener, healthier communities.',
    images: [env1, env2, env3],
  },
  {
    category: 'Environment',
    icon: Leaf,
    title: 'Clean Community & Temple Initiative',
    desc: 'Organizing cleanliness drives in public places and hill temples to promote a cleaner environment, civic responsibility, and community participation.',
    images: [env4],
  },
  {
    category: 'Health & Medical',
    icon: Stethoscope,
    title: 'Community Blood Donation Camp',
    desc: 'Conducting blood donation camps in colleges and hospitals to encourage voluntary blood donation and support patients and healthcare communities in need.',
    images: [hm1, hm2, hm3],
  },
  {
    category: 'Sports & Events',
    icon: Trophy,
    title: 'Youth Sports Tournament',
    desc: 'Organizing sports tournaments and competitions for school and college students to encourage fitness, teamwork, discipline, and a spirit of healthy competition.',
    images: [se1, se2],
  },
  {
    category: 'Community Welfare',
    icon: HeartHandshake,
    title: 'Care & Support for Orphanages and Old Age Homes',
    desc: 'Providing food, essential supplies, and support to orphanages and old age homes, helping create a caring and supportive environment for people in need.',
    images: [ooh1, ooh2, ooh3],
  },
  {
    category: 'Disaster Relief',
    icon: LifeBuoy,
    title: 'Natural Disaster Relief Initiative',
    desc: 'Providing food, essential supplies, and basic necessities to individuals and families affected by natural disasters during times of crisis and urgent need.',
    images: [nd1, nd2],
  },
]

export default function EventsGridSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-20 md:py-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div
              key={ev.title}
              className="border border-brand-border rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <ImageSlider
                images={ev.images}
                interval={5000}
                alt={ev.title}
                className="h-48"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-rust/10 text-brand-rust flex items-center justify-center shrink-0">
                    <ev.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold tracking-wide uppercase text-brand-rust">
                    {ev.category}
                  </p>
                </div>
                <h2 className="font-serif text-xl text-brand-ink mb-2 leading-snug">{ev.title}</h2>
                <p className="text-brand-muted text-sm leading-relaxed">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
