import { useState } from 'react'
import { Award, Download, Eye } from 'lucide-react'
import { getCertificateSignedUrl } from '../../utils/api.js'

export default function CertificateCard({ applicationId, accessToken, certificate }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const open = async (download) => {
    setLoading(true)
    setError('')
    try {
      const { url } = await getCertificateSignedUrl(applicationId, accessToken)
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      if (download) a.download = `${certificate.certificateNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      setError(err.message || 'Failed to open certificate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-brand-navy to-[#102a5e] rounded-2xl shadow-sm p-6 sm:p-8 text-white">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-white/60">Certificate Available</p>
          <p className="font-semibold truncate">{certificate.certificateNumber}</p>
          <p className="text-xs text-white/60">
            Issued {new Date(certificate.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-red-200 mb-3">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => open(false)}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <Eye className="w-4 h-4" /> View Certificate
        </button>
        <button
          type="button"
          onClick={() => open(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white text-brand-navy px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-95 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Download Certificate
        </button>
      </div>
    </div>
  )
}
