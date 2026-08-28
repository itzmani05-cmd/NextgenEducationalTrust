import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, UserRound, ArrowUpRight } from 'lucide-react'
import logo from '../assests/Logo.png'

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
    <footer className="bg-brand-ink text-white/60">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-16 md:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-lg mb-4">
            <img src={logo} alt="" className="w-9 h-9 object-contain" />
            NextGen Educational Trust
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Supporting deserving students through fee concessions and the C³ Educational Platform&apos;s
            technical skill development program.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5">Quick Links</p>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5">Support</p>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white mb-5">Get In Touch</p>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-center gap-2.5">
              <UserRound className="w-4 h-4 shrink-0 text-brand-rust" />
              Career Advisor: S. Ramesh Kumar, M.E.
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0 text-brand-rust" />
              93423 79043 / 97902 13628
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0 text-brand-rust" />
              nextgencollegesolutions@gmail.com
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-rust" />
              4/1023 D, Ayyalu Meenakshi Nagar, Udumalpet – 642 126, Tamil Nadu
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] 5xl:max-w-[2240px] 6xl:max-w-[2560px] 7xl:max-w-[2880px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; 2026 NextGen Solutions Educational Trust. All rights reserved.</p>
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
    </footer>
  )
}
