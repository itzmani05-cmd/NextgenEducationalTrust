import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, UserRound, ArrowUpRight } from 'lucide-react'
import logo from '../assests/Logo.webp'

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
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
]

export default function Footer() {
  return (
    <footer className="relative bg-brand-ink text-white/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-rust/70 to-transparent" />

      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-16 md:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg mb-4">
            <img src={logo} alt="" className="w-9 h-9 object-contain" />
            NextGen Solutions Educational Trust
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Supporting deserving students through fee concessions and the C³ Educational Platform&apos;s
            technical skill development program.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5 relative inline-block pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-8 after:bg-brand-rust">
            Quick Links
          </p>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex items-center gap-1.5 hover:text-white hover:translate-x-0.5 transition-all"
                >
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5 relative inline-block pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-8 after:bg-brand-rust">
            Support
          </p>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex items-center gap-1.5 hover:text-white hover:translate-x-0.5 transition-all"
                >
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5 relative inline-block pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-8 after:bg-brand-rust">
            Get In Touch
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-white/5 ring-1 ring-white/10">
                <UserRound className="w-3.5 h-3.5 text-brand-rust" />
              </span>
              <span className="pt-1 leading-snug">Career Advisor: S. Ramesh Kumar, M.E.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-white/5 ring-1 ring-white/10">
                <Phone className="w-3.5 h-3.5 text-brand-rust" />
              </span>
              <span className="pt-1 leading-snug">93423 79043 / 97902 13628</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-white/5 ring-1 ring-white/10">
                <Mail className="w-3.5 h-3.5 text-brand-rust" />
              </span>
              <span className="pt-1 leading-snug break-all">nextgencollegesolutions@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-white/5 ring-1 ring-white/10">
                <MapPin className="w-3.5 h-3.5 text-brand-rust" />
              </span>
              <span className="pt-1 leading-snug">
                4/1023 D, Ayyalu Meenakshi Nagar, Udumalpet – 642 126, Tamil Nadu
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-white/50">
            &copy; {new Date().getFullYear()} NextGen Solutions Educational Trust. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-white/40">
              <Link to="/privacy-policy" className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <span className="h-3 w-px bg-white/15" />
              <Link to="/terms-of-service" className="hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
            </div>
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
          </div>
        </div>
      </div>
    </footer>
  )
}
