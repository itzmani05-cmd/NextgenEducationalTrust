import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, UserRound, ArrowUpRight, ArrowUp, Heart, GraduationCap } from 'lucide-react'
import logo from '../assests/Logo.webp'

const containerClasses =
  'max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/platform', label: 'C³ Platform' },
  { to: '/events', label: 'News & Events' },
  { to: '/apply', label: 'Apply for Scholarship' },
  { to: '/status', label: 'Check Application Status' },
]

const supportLinks = [
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/faq', label: 'FAQ' },
]

const contacts = [
  { icon: UserRound, text: 'Career Advisor: S. Ramesh Kumar, M.E.' },
  {
    icon: Phone,
    text: (
      <>
        <a href="tel:+919342379043" className="hover:text-white transition-colors">93423 79043</a>
        <span className="text-white/30"> / </span>
        <a href="tel:+919790213628" className="hover:text-white transition-colors">97902 13628</a>
      </>
    ),
  },
  {
    icon: Mail,
    text: (
      <a href="mailto:nextgencollegesolutions@gmail.com" className="break-all hover:text-white transition-colors">
        nextgencollegesolutions@gmail.com
      </a>
    ),
  },
  { icon: MapPin, text: '4/1023 D, Ayyalu Meenakshi Nagar, Udumalpet – 642 126, Tamil Nadu' },
]

function ColumnHeading({ children }) {
  return (
    <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5 relative inline-block pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-8 after:bg-brand-rust">
      {children}
    </p>
  )
}

function LinkColumn({ title, links }) {
  return (
    <div>
      <ColumnHeading>{title}</ColumnHeading>
      <ul className="space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="group inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <span className="h-px w-2 bg-white/30 group-hover:w-4 group-hover:bg-brand-rust transition-all" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative bg-brand-ink text-white/60 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-rust/70 to-transparent" />
      <div className="pointer-events-none absolute -top-40 right-0 w-[28rem] h-[28rem] rounded-full bg-brand-navy/25 blur-3xl" />

      <div className={`${containerClasses} relative pt-14 md:pt-16`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 md:p-8">
          <div>
            <p className="font-serif text-2xl md:text-3xl text-white leading-tight">
              Help a student build their future.
            </p>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Apply for a fee concession, or support the Trust with a donation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-brand-ink font-semibold text-sm px-5 py-3 hover:bg-brand-cream transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Apply for Scholarship
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-rust text-white font-semibold text-sm px-5 py-3 hover:bg-brand-rustDark transition-colors"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`${containerClasses} relative py-14 md:py-16 grid gap-x-8 gap-y-12 grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]`}
      >
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg mb-4">
            <img src={logo} alt="" className="w-10 h-10 object-contain" />
            NextGen Solutions Educational Trust
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Supporting deserving students through fee concessions and the C³ Educational Platform&apos;s
            technical skill development program.
          </p>
        </div>

        <LinkColumn title="Quick Links" links={quickLinks} />
        <LinkColumn title="Support" links={supportLinks} />

        <div className="col-span-2 lg:col-span-1">
          <ColumnHeading>Get In Touch</ColumnHeading>
          <ul className="space-y-4 text-sm">
            {contacts.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="w-3.5 h-3.5 text-brand-rust" />
                </span>
                <span className="pt-1.5 leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div
          className={`${containerClasses} py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-center md:text-left`}
        >
          <p className="text-white/50">
            &copy; {new Date().getFullYear()} NextGen Solutions Educational Trust. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/privacy-policy" className="text-white/40 hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <Link to="/terms-of-service" className="text-white/40 hover:text-white/80 transition-colors">
              Terms of Service
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <p className="flex items-center gap-1">
              Developed by{' '}
              <a
                href="https://www.manidevfolio.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-white/80 font-medium hover:text-white transition-colors"
              >
                Manikandan
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="ml-1 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 ring-1 ring-white/10 text-white/70 hover:text-white hover:bg-brand-rust hover:ring-brand-rust transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
