import edu1 from '../assests/events/education/edu1.jpeg'
import edu2 from '../assests/events/education/edu2.jpeg'
import env1 from '../assests/events/environment/env1.jpeg'
import env2 from '../assests/events/environment/env2.jpeg'
import env3 from '../assests/events/environment/env3.jpeg'
import env4 from '../assests/events/environment/env4.jpeg'
import hm1 from '../assests/events/health&medical/hm1.jpeg'
import hm2 from '../assests/events/health&medical/hm2.jpeg'
import hm3 from '../assests/events/health&medical/hm3.jpeg'
import nd1 from '../assests/events/naturaldisaster/nd1.jpeg'
import nd2 from '../assests/events/naturaldisaster/nd2.jpeg'
import ooh1 from '../assests/events/orphonage&oldhome/ooh1.jpeg'
import ooh2 from '../assests/events/orphonage&oldhome/ooh2.jpeg'
import ooh3 from '../assests/events/orphonage&oldhome/ooh3.jpeg'
import se1 from '../assests/events/sports&events/se1.jpeg'
import se2 from '../assests/events/sports&events/se2.jpeg'

const events = [
  {
    title: 'Exam Kit Distribution for Government School Students',
    desc: 'Providing essential exam kits to government school students, helping them prepare for their examinations with confidence and the resources they need.',
    images: [edu1],
  },
  {
    title: 'Library Book Donation Drive',
    desc: 'Donating educational and reference books to government schools to strengthen their libraries and encourage students to develop a lasting habit of reading.',
    images: [edu2],
  },
  {
    title: 'Community Tree Plantation Drive',
    desc: 'Conducting tree plantation activities across villages and public parks to promote environmental awareness and contribute to greener, healthier communities.',
    images: [env1, env2, env3],
  },
  {
    title: 'Clean Community & Temple Initiative',
    desc: 'Organizing cleanliness drives in public places and hill temples to promote a cleaner environment, civic responsibility, and community participation.',
    images: [env4],
  },
  {
    title: 'Community Blood Donation Camp',
    desc: 'Conducting blood donation camps in colleges and hospitals to encourage voluntary blood donation and support patients and healthcare communities in need.',
    images: [hm1, hm2, hm3],
  },
  {
    title: 'Youth Sports Tournament',
    desc: 'Organizing sports tournaments and competitions for school and college students to encourage fitness, teamwork, discipline, and a spirit of healthy competition.',
    images: [se1, se2],
  },
  {
    title: 'Care & Support for Orphanages and Old Age Homes',
    desc: 'Providing food, essential supplies, and support to orphanages and old age homes, helping create a caring and supportive environment for people in need.',
    images: [ooh1, ooh2, ooh3],
  },
  {
    title: 'Natural Disaster Relief Initiative',
    desc: 'Providing food, essential supplies, and basic necessities to individuals and families affected by natural disasters during times of crisis and urgent need.',
    images: [nd1, nd2],
  },
]

export default function Events() {
  return (
    <div className="bg-white">
      <section className="bg-brand-cream">
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-5">
            Upcoming &amp; Past Events
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Join us in our mission to empower communities. Discover our upcoming initiatives,
            participate in awareness drives, and explore the impact of our past events.
          </p>
        </div>
      </section>

      <section className="max-w-6xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 py-24 space-y-16">
        {events.map((ev) => (
          <div key={ev.title}>
            <h2 className="font-serif text-2xl text-brand-ink mb-1.5">{ev.title}</h2>
            <p className="text-brand-muted text-sm mb-6 max-w-2xl">{ev.desc}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ev.images.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-brand-border">
                  <img
                    src={src}
                    alt={`${ev.title} photo ${i + 1}`}
                    className="w-full h-56 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
