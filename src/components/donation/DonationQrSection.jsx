import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import qrCode from '../../assests/QrPic.jpeg'

const UPI_NUMBER = '6369925623'
const ACCOUNT_NAME = 'Manikandan Muralikrishna'

const BANK_NAME = 'City Union Bank'
const BANK_ACCOUNT_NAME = 'NEXTGEN SOLUTIONS EDUCATIONAL TRUST'
const BANK_ACCOUNT_NUMBER = '510909010405740'
const BANK_IFSC = 'CIUB0000138'
const BANK_BRANCH = 'Udumalpet'
const BANK_ACCOUNT_TYPE = 'Current Account'

export default function DonationQrSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access unavailable — user can still copy the number manually
    }
  }

  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            How to Donate
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">Choose Your Payment Method</h2>
        </div>

        <div className="border border-brand-border rounded-2xl p-8 md:p-10 grid sm:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center text-center">
            <img
              src={qrCode}
              alt="Scan to pay via UPI"
              className="w-52 h-52 object-contain rounded-xl border border-brand-border p-2"
            />
            <p className="text-sm text-brand-muted mt-4">Scan with any UPI app to pay</p>
          </div>

          <div className="sm:border-l sm:border-brand-border sm:pl-10">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-muted mb-4">
              Or Pay Via Paytm / PhonePe / GPay
            </p>
            <div className="space-y-5">
              <div>
                <span className="block text-xs text-brand-muted mb-1">Mobile Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl text-brand-ink tracking-wide">{UPI_NUMBER}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-md text-brand-muted hover:text-brand-rust hover:bg-brand-cream transition-colors"
                    aria-label="Copy UPI number"
                    title="Copy number"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <span className="block text-xs text-brand-muted mb-1">Account Name</span>
                <span className="text-sm font-semibold text-brand-ink">{ACCOUNT_NAME}</span>
              </div>
            </div>
            {copied && <p className="text-xs text-emerald-700 mt-3">Number copied to clipboard</p>}
          </div>
        </div>

        <div className="border border-brand-border rounded-2xl p-8 md:p-10 mt-8">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-muted mb-5 text-center sm:text-left">
            Or Pay Via Bank Transfer
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="block text-xs text-brand-muted mb-1">Bank Name</span>
              <span className="text-sm font-semibold text-brand-ink">{BANK_NAME}</span>
            </div>
            <div>
              <span className="block text-xs text-brand-muted mb-1">Account Name</span>
              <span className="text-sm font-semibold text-brand-ink">{BANK_ACCOUNT_NAME}</span>
            </div>
            <div>
              <span className="block text-xs text-brand-muted mb-1">Account Number</span>
              <span className="text-sm font-semibold text-brand-ink">{BANK_ACCOUNT_NUMBER}</span>
            </div>
            <div>
              <span className="block text-xs text-brand-muted mb-1">IFSC Code</span>
              <span className="text-sm font-semibold text-brand-ink">{BANK_IFSC}</span>
            </div>
            <div>
              <span className="block text-xs text-brand-muted mb-1">Branch</span>
              <span className="text-sm font-semibold text-brand-ink">{BANK_BRANCH}</span>
            </div>
            <div>
              <span className="block text-xs text-brand-muted mb-1">Account Type</span>
              <span className="text-sm font-semibold text-brand-ink">{BANK_ACCOUNT_TYPE}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
