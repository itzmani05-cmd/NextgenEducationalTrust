const sections = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By creating an account or using this website, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.',
    ],
  },
  {
    title: '2. Eligibility & Accurate Information',
    body: [
      'You must provide accurate, current, and complete information when creating an account or submitting a scholarship application. Providing false information, or forged or altered documents, may result in rejection of your application and removal of your account.',
    ],
  },
  {
    title: '3. Scholarship Applications & Verification',
    body: [
      'Submitting an application does not guarantee an award. All applications are subject to document verification and eligibility review at the Trust’s discretion, based on the categories and criteria published on our Scholarships page.',
      'Concession percentages and payable amounts are calculated based on the information and documents you provide, and are confirmed only once verification and Trust approval are complete.',
    ],
  },
  {
    title: '4. Your Account',
    body: [
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately if you suspect unauthorised use of your account.',
    ],
  },
  {
    title: '5. Payments',
    body: [
      'Where a scholarship is approved, any remaining payable amount after concession must be paid through the method described on your Payment page. Proof of payment you submit is reviewed by the Trust before it is marked as confirmed.',
    ],
  },
  {
    title: '6. Acceptable Use',
    body: [
      'You agree not to misuse the platform — including attempting to access other applicants’ records, uploading fraudulent documents, or interfering with the normal operation of the site.',
    ],
  },
  {
    title: '7. The C3 Educational Platform',
    body: [
      'Where a scholarship includes access to GATE or government exam coaching through the C3 Educational Platform, that access is provided for your personal academic use and may not be shared, resold, or redistributed.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'The Trust provides this platform on an "as is" basis and makes reasonable efforts to keep it accurate and available, but is not liable for indirect or incidental damages arising from your use of the site, to the extent permitted by law.',
    ],
  },
  {
    title: '9. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised Terms.',
    ],
  },
  {
    title: '10. Governing Law',
    body: [
      'These Terms are governed by the laws of India. Any disputes arising from your use of this platform will be subject to the jurisdiction of the courts in Tamil Nadu.',
    ],
  },
]

export default function TermsOfService() {
  return (
    <div className="bg-white">
      <section className="bg-brand-surface">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-3">
            Terms of Service
          </h1>
          <p className="text-brand-muted text-sm">Last revised: August 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-brand-muted mb-10">
          These Terms of Service govern your use of the NextGen College Solutions website and
          scholarship platform, including applications processed through the C3 Educational
          Platform.
        </p>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-brand-navy mb-3">{s.title}</h2>
              <div className="space-y-3">
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm text-brand-muted leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-brand-surface rounded-lg p-4 text-sm text-brand-navy">
          Questions about these Terms? Reach us at{' '}
          <a href="mailto:nextgencollegesolutions@gmail.com" className="font-medium hover:underline">
            nextgencollegesolutions@gmail.com
          </a>
          .
        </div>
      </section>
    </div>
  )
}
