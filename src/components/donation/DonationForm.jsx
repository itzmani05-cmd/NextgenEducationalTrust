const QUICK_AMOUNTS = ['500', '1000', '2500', '5000']

const PURPOSE_OPTIONS = ['General Fund', 'Scholarship Support', 'Event Sponsorship', 'Other']

const inputClasses =
  'w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-rust/30 focus:border-brand-rust transition-colors'

const labelClasses = 'block text-sm font-semibold text-brand-ink mb-1.5'

function pillClasses(active) {
  return `px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
    active
      ? 'bg-brand-rust text-white border-brand-rust'
      : 'bg-white text-brand-ink border-brand-border hover:border-brand-rust'
  }`
}

export default function DonationForm({ form, errors, onChange, submitting, onSubmit }) {
  return (
    <section className="bg-white" id="donation-form">
      <div className="max-w-4xl mx-auto px-6 pb-20 md:pb-28">
        <div className="text-center mb-10">
          <span className="inline-flex items-center text-xs font-semibold tracking-[0.15em] uppercase border border-brand-border rounded-full px-4 py-1.5 mb-6 text-brand-muted">
            Confirm Your Gift
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-ink">Your Details</h2>
        </div>

        <form onSubmit={onSubmit} className="bg-brand-cream rounded-2xl p-8 md:p-10 border border-brand-border space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className={labelClasses}>Full Name</span>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                placeholder="Jane Doe"
                className={inputClasses}
              />
            </label>
            <label className="block">
              <span className={labelClasses}>Email Address</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="jane@example.com"
                className={inputClasses}
              />
              <span className="block text-xs text-brand-muted mt-1.5">
                Your donation receipt will be sent here once payment is verified.
              </span>
            </label>
          </div>

          <label className="block">
            <span className={labelClasses}>Mobile Number</span>
            <input
              type="text"
              required
              value={form.mobile}
              onChange={(e) => onChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className={inputClasses}
            />
            {errors.mobile && <span className="block text-xs text-brand-red mt-1.5">{errors.mobile}</span>}
          </label>

          <div>
            <span className={labelClasses}>Donation Amount (₹)</span>
            <div className="flex flex-wrap gap-2 mb-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => onChange('amount', amt)}
                  className={pillClasses(form.amount === amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => onChange('amount', e.target.value)}
              placeholder="Enter custom amount"
              className={inputClasses}
            />
          </div>

          <div>
            <span className={labelClasses}>Purpose</span>
            <div className="flex flex-wrap gap-2">
              {PURPOSE_OPTIONS.map((p) => (
                <button type="button" key={p} onClick={() => onChange('purpose', p)} className={pillClasses(form.purpose === p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className={labelClasses}>PAN Number</span>
            <input
              type="text"
              value={form.pan}
              onChange={(e) => onChange('pan', e.target.value.toUpperCase().slice(0, 10))}
              placeholder="e.g. ABCDE1234F"
              className={inputClasses}
            />
            <span className="block text-xs text-brand-muted mt-1.5">
              {errors.pan || 'Optional — required only if you need an 80G tax exemption receipt.'}
            </span>
          </label>

          <label className="block">
            <span className={labelClasses}>Transaction Reference Number</span>
            <input
              type="text"
              required
              value={form.transactionRef}
              onChange={(e) => onChange('transactionRef', e.target.value)}
              placeholder="UPI Ref / UTR number after payment"
              className={inputClasses}
            />
            <span className="block text-xs text-brand-muted mt-1.5">
              Complete the payment above first, then enter the reference number shown in your UPI app.
            </span>
          </label>

          {errors.submit && <p className="text-sm text-brand-red">{errors.submit}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-rust text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-brand-rustDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Donation Details'}
          </button>
        </form>
      </div>
    </section>
  )
}
