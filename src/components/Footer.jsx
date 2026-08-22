import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, UserRound } from 'lucide-react'
import logo from '../assests/Logo.png'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl 3xl:max-w-[1600px] 4xl:max-w-[1920px] mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <p className="flex items-center gap-2 text-white font-bold text-lg mb-2">
            <img src={logo} alt="" className="w-8 h-8 object-contain" />
            NextGen College Solutions
          </p>
          <p className="text-sm mb-4">
            &copy; 2026 NextGen College Solutions. All rights reserved.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <UserRound className="w-4 h-4 shrink-0" />
              Career Advisor: S. Ramesh Kumar, M.E.
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              93423 79043 / 97902 13628
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              nextgencollegesolutions@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              4/1023 D, Ayyalu Meenakshi Nagar, Udumalpet – 642 126, Tamil
              Nadu
            </li>
          </ul>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
