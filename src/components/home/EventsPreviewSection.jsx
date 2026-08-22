import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import edu2 from '../../assests/events/education/edu2.jpeg'
import hm2 from '../../assests/events/health&medical/hm2.jpeg'
import env2 from '../../assests/events/environment/env2.jpeg'

const events = [
  {
    category: 'Health & Medical',
    title: 'Community Blood Donation Camp',
    desc: 'Conducting blood donation camps in colleges and hospitals to encourage voluntary blood donation and support patients and healthcare communities in need.',
    image: hm2,
  },
  {
    category: 'Environment',
    title: 'Community Tree Plantation Drive',
    desc: 'Conducting tree plantation activities across villages and public parks to promote environmental awareness and contribute to greener, healthier communities.',
    image: env2,
  },
  {
    category: 'Education',
    title: 'Library Book Donation Drive',
    desc: 'Donating educational and reference books to government schools to strengthen their libraries and encourage students to develop a lasting habit of reading.',
    image: edu2,
  },
]

export default function EventsPreviewSection() {
  return (
    <section id="events" className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
          <div>
            <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
              Events
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">Community Engagements</h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-brand-rust hover:text-brand-rustDark transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div key={ev.title} className="border border-brand-border rounded-xl overflow-hidden">
              <img src={ev.image} alt={ev.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-brand-rust mb-2">
                  {ev.category}
                </p>
                <h3 className="font-serif text-xl text-brand-ink mb-2">{ev.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
