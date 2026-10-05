import { useState } from 'react'
import { KeyRound, Copy, Check } from 'lucide-react'

export default function CredentialsDialog({ credentials, onClose }) {
  const [copied, setCopied] = useState(false)
  if (!credentials) return null

  const loginUrl = `${window.location.origin}/staff/login`
  const text =
    `NextGen Trust Staff Portal\n` +
    `Login: ${loginUrl}\n` +
    `Staff ID: ${credentials.staffCode}\n` +
    `Temporary password: ${credentials.tempPassword}\n` +
    `You will be asked to set your own password after signing in.`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-label="Staff login details" className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <div className="w-11 h-11 rounded-full bg-green-50 text-green-700 flex items-center justify-center mb-3">
          <KeyRound className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-brand-navy">{credentials.title || 'Login details'}</h2>
        <p className="text-sm text-brand-muted mt-1 mb-4">
          Share these with <strong className="text-brand-text">{credentials.name}</strong>. The temporary password is shown only now.
        </p>

        <dl className="rounded-lg border border-brand-border divide-y divide-brand-border text-sm mb-4">
          <div className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-brand-muted">Login page</dt>
            <dd className="font-medium text-brand-text truncate">{loginUrl.replace(/^https?:\/\//, '')}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-brand-muted">Staff ID</dt>
            <dd className="font-mono font-bold text-brand-text">{credentials.staffCode}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-brand-muted">Temporary password</dt>
            <dd className="font-mono font-bold text-brand-text tracking-wide">{credentials.tempPassword}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-brand-border text-brand-text hover:border-brand-navy">
            {copied ? <><Check className="w-4 h-4 text-green-600" /> Copied</> : <><Copy className="w-4 h-4" /> Copy details</>}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
