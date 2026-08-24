import se2 from '../../assests/events/sports&events/se2.jpeg'
import edu1 from '../../assests/events/education/edu1.jpeg'
import hm3 from '../../assests/events/health&medical/hm3.jpeg'
import nd2 from '../../assests/events/naturaldisaster/nd2.jpeg'
import ooh2 from '../../assests/events/orphonage&oldhome/ooh2.jpeg'

const images = [se2, edu1, hm3, nd2, ooh2]

export default function GallerySection() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Gallery
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-ink">Moments of Hope</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-3 sm:grid-rows-2 gap-4 h-[440px] sm:h-[520px]">
          <img
            src={images[0]}
            alt="Youth sports tournament team photo"
            className="col-span-2 sm:col-span-1 row-span-1 sm:row-span-2 w-full h-full object-cover rounded-xl"
          />
          <img src={images[1]} alt="Exam kit distribution to government school students" className="w-full h-full object-cover rounded-xl" />
          <img src={images[2]} alt="Community blood donation camp" className="w-full h-full object-cover rounded-xl" />
          <img src={images[3]} alt="Natural disaster relief support" className="w-full h-full object-cover rounded-xl" />
          <img src={images[4]} alt="Care and support at an old age home" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
    </section>
  )
}
