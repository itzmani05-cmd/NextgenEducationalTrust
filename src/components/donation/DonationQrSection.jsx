import qrCode from '../../assests/QrPic.jpeg'

const BANK_NAME = 'City Union Bank'
const BANK_ACCOUNT_NAME = 'NEXTGEN SOLUTIONS EDUCATIONAL TRUST'
const BANK_ACCOUNT_NUMBER = '510909010405740'
const BANK_IFSC = 'CIUB0000138'
const BANK_BRANCH = 'Udumalpet'
const BANK_ACCOUNT_TYPE = 'Current Account'

export default function DonationQrSection() {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-12">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            How to Donate
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">Choose Your Payment Method</h2>
        </div>

        <div className="border border-brand-border rounded-2xl p-8 md:p-10 flex flex-col items-center text-center">
          <img
            src={qrCode}
            alt="Scan to pay via UPI"
            className="w-52 h-52 object-contain rounded-xl border border-brand-border p-2"
          />
          <p className="text-sm text-brand-muted mt-4">Scan with any UPI app to pay</p>
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
