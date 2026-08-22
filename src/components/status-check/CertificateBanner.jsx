import { Link } from 'react-router-dom'
import { Award } from 'lucide-react'

export default function CertificateBanner({ certificate }) {
  return (
    <div className="bg-gradient-to-br from-brand-navy to-[#102a5e] rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-3 text-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">Certificate Available</p>
          <p className="font-semibold">{certificate.certificateNumber}</p>
        </div>
      </div>
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 bg-white text-brand-navy px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95 transition-all"
      >
        Sign in to download
      </Link>
    </div>
  )
}
