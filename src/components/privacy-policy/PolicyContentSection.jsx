const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'When you create an account, apply for a scholarship, or contact us, we collect information you provide directly, including your name, date of birth, contact details, address, family and financial details, academic records, and identity documents.',
      'For scholarship applications, this also includes income certificates, mark sheets, community certificates, and other supporting documents you upload for verification.',
      'We automatically collect limited technical information, such as your browser type and how you use the site, to keep the platform secure and working correctly.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'To process and verify scholarship applications, calculate concessions, and record payments against your fee account.',
      'To communicate with you about your application status, verification requests, and payment confirmations.',
      'To provide access to the C3 Educational Platform where a scholarship covers coaching support.',
      'To maintain the security of accounts and prevent fraudulent applications.',
    ],
  },
  {
    title: '3. How We Share Information',
    body: [
      'We do not sell your personal information. Your application details and documents are visible only to authorised Trust staff reviewing your application.',
      'We use trusted third-party service providers — including Supabase for authentication and secure document storage — solely to operate the platform on our behalf. These providers are bound to handle your data only as instructed by us.',
      'We may disclose information if required by law or to protect the rights, property, or safety of the Trust, our applicants, or the public.',
    ],
  },
  {
    title: '4. Document & Data Retention',
    body: [
      'Application records and supporting documents are retained for as long as needed to administer your scholarship, meet audit and compliance requirements, and resolve any disputes, after which they are securely deleted or anonymised.',
    ],
  },
  {
    title: '5. Your Rights',
    body: [
      'You may request access to, correction of, or deletion of your personal information by contacting us at nextgencollegesolutions@gmail.com. We will respond within a reasonable timeframe, subject to any records we are legally required to retain.',
    ],
  },
  {
    title: '6. Children’s Privacy',
    body: [
      'Many applicants are students, some of whom may be minors. Where an applicant is a minor, we expect a parent or guardian to be involved in submitting the application and reviewing this policy on the student’s behalf.',
    ],
  },
  {
    title: '7. Security',
    body: [
      'We use industry-standard safeguards, including encrypted storage and access controls, to protect your information. No method of transmission or storage is completely secure, but we work to protect your data using commercially reasonable measures.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Material changes will be reflected by an updated "last revised" date on this page.',
    ],
  },
]

export default function PolicyContentSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-brand-muted mb-10">
        This Privacy Policy explains how NextGen Solutions (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;the Trust&rdquo;) collects, uses, and protects your
        information when you use our website and scholarship platform.
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
        Questions about this policy? Reach us at{' '}
        <a href="mailto:nextgencollegesolutions@gmail.com" className="font-medium hover:underline">
          nextgencollegesolutions@gmail.com
        </a>
        .
      </div>
    </section>
  )
}
