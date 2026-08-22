import { Link } from 'react-router-dom'
import ImageSlider from '../components/ImageSlider.jsx'
import FaqItem from '../components/FaqItem.jsx'
import c3PlatformPic1 from '../assests/c3Platform/Pic1.jpeg'
import c3PlatformPic2 from '../assests/c3Platform/Pic2.jpeg'
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Star,
  HeartHandshake,
  Users,
  HeartPulse,
  Info,
  GraduationCap,
  Landmark,
  Award,
  BookOpen,
  BarChart3,
  BadgeCheck,
  Percent,
} from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: '1. Apply',
    desc: 'Submit your application securely through our straightforward online form.',
  },
  {
    icon: ShieldCheck,
    title: '2. Verification',
    desc: 'Our team reviews your documents and verifies your eligibility criteria.',
  },
  {
    icon: CheckCircle2,
    title: '3. Approval',
    desc: 'Receive notification of your application status and awarded concession.',
  },
  {
    icon: Wallet,
    title: '4. Payment',
    desc: 'Approved funds are processed transparently against your fee account.',
  },
]

const categories = [
  {
    icon: Star,
    title: 'Merit-Based',
    desc: 'Awarded to students demonstrating exceptional academic achievement. Requires a minimum GPA of 3.8 and teacher recommendations.',
  },
  {
    icon: HeartHandshake,
    title: 'Need-Based',
    desc: 'Financial support for students facing economic hardship. Requires submission of valid income certificates and tax returns.',
  },
  {
    icon: Users,
    title: 'Single Parent',
    desc: 'Dedicated assistance for students from single-parent households, ensuring continued access to quality education.',
  },
  {
    icon: HeartPulse,
    title: 'Orphan Support',
    desc: 'Comprehensive fee concession covering 100% of tuition costs for eligible orphaned students.',
  },
]

const advantages = [
  {
    icon: Award,
    title: 'Expert Mentorship',
    desc: 'Guidance from top academicians and industry professionals.',
  },
  {
    icon: BookOpen,
    title: 'Structured Curriculum',
    desc: 'Syllabus broken down into manageable, logical modules.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Tracking',
    desc: 'Real-time analytics to monitor your progress and identify weak areas.',
  },
  {
    icon: HeartHandshake,
    title: 'Holistic Support',
    desc: 'Comprehensive support extending beyond just academics to mental well-being.',
  },
]

const eligibility = [
  'Currently enrolled as a full-time student for the academic year 2025-2026.',
  'Clear disciplinary record with no outstanding infractions.',
  'Valid government-issued identification and address proof.',
  'Bank account details linked to the primary applicant.',
  'Submission of required category-specific documentation before the deadline.',
]

const faqs = [
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
]

function TrackCard({ icon: Icon, title, subtitle, desc, points }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-11 h-11 rounded-lg bg-brand-surface text-brand-navy flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-brand-text">{title}</h3>
          <p className="text-xs text-brand-muted">{subtitle}</p>
        </div>
      </div>
      <hr className="border-brand-border mb-4" />
      <p className="text-sm text-brand-muted mb-5">{desc}</p>
      <ul className="space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-brand-text">
            <CheckCircle2 className="w-4 h-4 text-brand-navy shrink-0" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Scholarships() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-surface">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-navy/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-brand-red/5 blur-3xl" />

        <div className="relative max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-16 md:pb-24 md:pt-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-brand-navy px-3 py-1.5 rounded-full mb-5">
              <BadgeCheck className="w-3.5 h-3.5" />
              Scholarships &amp; Coaching, Together
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy leading-tight mb-5">
              Scholarships through the <span className="text-brand-red">C3</span> Educational
              Platform
            </h1>
            <p className="text-brand-muted mb-8 max-w-md">
              Every scholarship we award is delivered through the C3 Educational Platform —
              covering tuition support alongside expert-led GATE and government competitive exam
              coaching, so funding and preparation come from one place.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-redDark transition-colors"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#platform"
                className="inline-flex items-center gap-2 bg-white border border-brand-navy text-brand-navy px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-surface transition-colors"
              >
                Explore the Platform
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: GraduationCap, value: '2', label: 'Coaching Tracks' },
                { icon: Percent, value: '100%', label: 'Max Concession' },
                { icon: FileText, value: '4-Step', label: 'Application' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label}>
                  <Icon className="w-5 h-5 text-brand-red mb-1.5" />
                  <p className="text-lg font-bold text-brand-navy leading-tight">{value}</p>
                  <p className="text-xs text-brand-muted leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <ImageSlider
              images={[c3PlatformPic1, c3PlatformPic2]}
              interval={7000}
              alt="Students at a C3 Educational Platform classroom session"
              className="rounded-3xl shadow-xl h-80 md:h-[26rem]"
            />
            <div className="absolute -bottom-5 left-6 right-6 sm:right-auto sm:w-64 bg-white border border-brand-border rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-surface text-brand-navy flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">C3 Educational Platform</p>
                <p className="text-xs text-brand-muted truncate">GATE &amp; Government Exam Coaching</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">How It Works</h2>
        <p className="text-brand-muted max-w-2xl mx-auto mb-12">
          A streamlined, transparent process designed to minimize cognitive load and get you the
          support you need faster.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-surface flex items-center justify-center text-brand-navy mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-brand-text mb-2">{title}</h3>
              <p className="text-sm text-brand-muted mb-4">{desc}</p>
              <div className="h-1 w-10 rounded-full bg-brand-navy" />
            </div>
          ))}
        </div>
      </section>

      {/* Scholarship Categories */}
      <section className="bg-brand-surface py-16">
        <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-10">
            Scholarship Categories
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {categories.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-brand-border rounded-xl p-6 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-navy text-white flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text mb-1">{title}</h3>
                  <p className="text-sm text-brand-muted mb-3">{desc}</p>
                  <a href="#" className="text-sm font-medium text-brand-red hover:underline">
                    View Requirements &rsaquo;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C3 Educational Platform */}
      <section id="platform" className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-16 text-center scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">
          The <span className="text-brand-red">C3</span> Educational Platform
        </h2>
        <p className="text-brand-muted max-w-2xl mx-auto mb-12">
          Where your scholarship goes to work: rigorous, specialized training for India&apos;s
          most demanding competitive examinations, funded directly through your awarded
          concession.
        </p>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <TrackCard
            icon={GraduationCap}
            title="GATE Preparation"
            subtitle="Graduate Aptitude Test in Engineering"
            desc="Comprehensive curriculum designed by top-tier faculty to master complex engineering concepts and problem-solving techniques essential for GATE success."
            points={[
              'Expert Faculty & Industry Veterans',
              'Simulated Mock Assessments',
              'Deep-dive Subject-Specific Modules',
              'Granular Performance Analytics',
            ]}
          />
          <TrackCard
            icon={Landmark}
            title="Govt Exam Prep"
            subtitle="UPSC, SSC, Banking & More"
            desc="Structured methodology to tackle diverse syllabi of government service exams, focusing on analytical skills, general awareness, and speed."
            points={[
              'Daily Current Affairs Updates',
              'Strategic Planning Sessions',
              'Personalized Interview Coaching',
              'Extensive Historical Question Banks',
            ]}
          />
        </div>
      </section>

      {/* The C3 Advantage */}
      <section className="bg-brand-surface py-16 text-center">
        <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-12">
            The C3 Advantage
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-brand-border rounded-xl p-6">
                <div className="w-11 h-11 mx-auto rounded-full bg-brand-surface text-brand-navy flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-brand-text mb-2">{title}</h3>
                <p className="text-sm text-brand-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">
            Start Your Scholarship Application Today
          </h2>
          <p className="text-brand-muted mb-8">
            Join the students already funded through the C3 Educational Platform and take the
            first step toward your goals.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-redDark transition-colors"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Eligibility + FAQ */}
      <section className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 pb-20 grid md:grid-cols-2 gap-6">
        <div className="border border-brand-border rounded-xl p-6">
          <h3 className="font-semibold text-brand-text mb-4">General Eligibility</h3>
          <ul className="space-y-3 mb-4">
            {eligibility.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-brand-muted">
                <CheckCircle2 className="w-4 h-4 text-brand-navy mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-brand-surface rounded-lg p-3 flex gap-2 text-xs text-brand-navy">
            <Info className="w-4 h-4 shrink-0" />
            Note: Meeting baseline eligibility does not guarantee an award; applications are
            reviewed against category-specific criteria.
          </div>
        </div>

        <div className="border border-brand-border rounded-xl p-6">
          <h3 className="font-semibold text-brand-text mb-2">Frequently Asked Questions</h3>
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </div>
  )
}
