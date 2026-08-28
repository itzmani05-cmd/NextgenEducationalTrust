import ReviewsCarousel from './ReviewsCarousel.jsx'

const reviews = [
  {
    name: 'Suba Sarvesh',
    rating: 5,
    time: '11 months ago',
    review:
      'C³ Classes is a gateway to fulfilling our dreams. It is the only institute dedicated exclusively to Civil Engineering students, helping us build strong technical knowledge with discipline and consistency. The faculty provides individual attention, ensuring that every student stays on the right path toward success. Regular tests, quality study materials, and concept-oriented teaching make C³ a reliable choice for competitive exam preparation. The disciplined environment, experienced mentors, and personalized guidance truly set this institute apart.',
  },
  {
    name: 'Afzal',
    rating: 5,
    time: '11 months ago',
    review:
      'Best coaching institute for civil engineering in Tamil Nadu. Faculty teaching methodology is awesome and they also take care of every student individually. Well-experienced faculty trained us. At the end of the course, we are well-versed in Civil Engineering from both conceptual and exam points of view. Definitely your dream comes true here as an aspirant.',
  },
  {
    name: 'Praveen Raj (Gokul)',
    rating: 5,
    time: '11 months ago',
    review:
      'One of the best places for Civil Engineering exam preparation. The teaching is very clear, with practical explanations and a problem-solving focus. The environment is disciplined, and it really helped me improve my confidence in tackling exams.',
  },
  {
    name: 'Kaavya',
    rating: 5,
    time: '11 months ago',
    review:
      'The best place to learn all the Civil Engineering concepts from the base and also General Science. A very good environment for exam preparation.',
  },
  {
    name: 'vignesh p',
    rating: 5,
    time: '5 months ago',
    review:
      'This place makes you strong in technical knowledge from zero to HERO. "Powerful people come from powerful places"',
  },
]

export default function ReviewsSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-5">
            What Our Students Say
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Reviews from students who trained with the C³ Educational Platform.
          </p>
        </div>
        <ReviewsCarousel items={reviews} />
      </div>
    </section>
  )
}
