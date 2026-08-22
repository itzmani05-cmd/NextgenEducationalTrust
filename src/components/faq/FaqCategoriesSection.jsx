import FaqItem from '../FaqItem.jsx'

const categories = [
  {
    title: 'General',
    faqs: [
      {
        q: 'What does NextGen College Solutions do?',
        a: 'We help students make informed decisions about higher education and careers, and administer scholarships that fund tuition support alongside GATE and government competitive exam coaching through the C3 Educational Platform.',
      },
      {
        q: 'How can I get in touch with the team?',
        a: 'Use the contact form on our Contact page, call us at 93423 79043 / 97902 13628, or email nextgencollegesolutions@gmail.com. We typically respond within 2 business days.',
      },
      {
        q: 'Do you offer support in Tamil as well as English?',
        a: 'Yes. Our application flow and support team can assist in both English and Tamil — let us know your preference when you reach out.',
      },
    ],
  },
  {
    title: 'Scholarships & the C3 Platform',
    faqs: [
      {
        q: 'What documents are required for income verification?',
        a: 'You will need to submit a recent income certificate issued by a competent authority, along with the latest income tax return (or a self-declaration if not applicable) for the head of household.',
      },
      {
        q: 'How long does the verification process take?',
        a: 'Verification typically takes 5-7 business days after all required documents have been submitted. You can track progress from your dashboard at any time.',
      },
      {
        q: 'Can I apply for multiple scholarship categories?',
        a: 'Yes, you may apply to more than one category if you meet the eligibility requirements for each, but only one award will be granted per academic year.',
      },
      {
        q: 'Does the scholarship cover C3 Educational Platform coaching?',
        a: 'Yes. Approved scholarship funds can be applied directly against GATE and government competitive exam preparation on the C3 Educational Platform, in addition to regular tuition fees.',
      },
    ],
  },
  {
    title: 'Applications & Your Account',
    faqs: [
      {
        q: 'How do I check the status of my application?',
        a: 'Sign in and visit the Check Application Status page. It shows real-time progress through document verification, approval, and payment.',
      },
      {
        q: 'I made a mistake on my submitted application — can I fix it?',
        a: 'Contact our support team as soon as possible with your application ID. If verification hasn’t completed yet, we can usually reopen the relevant section for correction.',
      },
      {
        q: 'How is my payment and concession calculated?',
        a: 'Once your application is approved, the Trust records your approved concession percentage against your original course fee; the resulting payable amount is shown on your Payment page before you submit proof of payment.',
      },
    ],
  },
]

export default function FaqCategoriesSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {categories.map((cat) => (
        <div key={cat.title}>
          <h2 className="text-xl font-bold text-brand-navy mb-2">{cat.title}</h2>
          <div className="border border-brand-border rounded-xl px-6">
            {cat.faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
