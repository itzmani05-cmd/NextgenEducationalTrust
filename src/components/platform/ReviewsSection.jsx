import ReviewsCarousel from './ReviewsCarousel.jsx'

const reviews = [
  {
    name: 'Varathan C',
    rating: 5,
    time: '8 months ago',
    review:
      'I had a great experience at [C^3]! As a Civil Engineering student, I found their classes extremely helpful for both academic subjects and competitive exams like IES, TNPSC AE, TRB, GATE, SSC JE. The faculty members are highly experienced and explain complex concepts in a simple and practical way. Their teaching style is very student-friendly. The study materials provided were up-to-date and covered all important topics in detail. Regular tests and performance analysis helped me track my progress and improve consistently. What I appreciated the most was their focus on concept clarity and real-time problem-solving. The classroom environment was also motivating, and the staff was supportive throughout my preparation. I highly recommend this coaching centre to anyone looking to build a strong foundation in Civil Engineering and succeed in exams.',
    likes: null,
  },
  {
    name: 'Suba Sarvesh',
    rating: 5,
    time: '11 months ago',
    review:
      'C³ Classes is a gateway to fulfilling our dreams. It is the only institute dedicated exclusively to Civil Engineering students, helping us build strong technical knowledge with discipline and consistency. The faculty provides individual attention, ensuring that every student stays on the right path toward success. Regular tests, quality study materials, and concept-oriented teaching make C³ a reliable choice for competitive exam preparation. The disciplined environment, experienced mentors, and personalized guidance truly set this institute apart.',
    likes: 1,
  },
  {
    name: 'Afzal',
    rating: 5,
    time: '11 months ago',
    review:
      'Best coaching institute for civil engineering in Tamil Nadu. Faculty teaching methodology is awesome and they also take care of every student individually. Well-experienced faculty trained us. At the end of the course, we are well-versed in Civil Engineering from both conceptual and exam points of view. Definitely your dream comes true here as an aspirant.',
    likes: null,
    badge: 'Local Guide',
  },
  {
    name: 'Praveen Raj (Gokul)',
    rating: 5,
    time: '11 months ago',
    review:
      'One of the best places for Civil Engineering exam preparation. The teaching is very clear, with practical explanations and a problem-solving focus. The environment is disciplined, and it really helped me improve my confidence in tackling exams.',
    likes: null,
  },
  {
    name: 'Kaavya',
    rating: 5,
    time: '11 months ago',
    review:
      'The best place to learn all the Civil Engineering concepts from the base and also General Science. A very good environment for exam preparation.',
    likes: null,
  },
  {
    name: 'vignesh p',
    rating: 5,
    time: '5 months ago',
    review:
      'This place makes you strong in technical knowledge from zero to HERO. "Powerful people come from powerful places"',
    likes: null,
  },
]

export default function ReviewsSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] mx-auto px-6 py-20 md:py-28">
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
