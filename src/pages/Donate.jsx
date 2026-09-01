import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import { breadcrumbSchema } from '../seo/schema.js'
import DonationHero from '../components/donation/DonationHero.jsx'
import DonationQrSection from '../components/donation/DonationQrSection.jsx'
import DonationForm from '../components/donation/DonationForm.jsx'
import DonationThankYou from '../components/donation/DonationThankYou.jsx'
import { submitDonation } from '../utils/api.js'

const initialForm = {
  fullName: '',
  email: '',
  mobile: '',
  amount: '',
  purpose: '',
  pan: '',
  transactionRef: '',
}

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/

export default function Donate() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field] || errors.submit) setErrors((prev) => ({ ...prev, [field]: '', submit: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.submit = 'Full name is required.'
    else if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.submit = 'Enter a valid email address.'
    else if (form.mobile.length !== 10) next.mobile = 'Enter a valid 10-digit mobile number.'
    else if (!form.amount || Number(form.amount) <= 0) next.submit = 'Enter a valid donation amount.'
    else if (!form.purpose) next.submit = 'Select a purpose for your donation.'
    else if (form.pan && !PAN_PATTERN.test(form.pan)) next.pan = 'PAN format should be like ABCDE1234F.'
    else if (!form.transactionRef.trim()) next.submit = 'Enter the transaction reference number.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setSubmitting(true)
    try {
      await submitDonation(form)
      setSubmitted({ ...form })
      setForm(initialForm)
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit donation.' })
    } finally {
      setSubmitting(false)
    }
  }

  const seo = (
    <SEO
      title="Donate | NextGen Solutions Educational Trust"
      description="Support NextGen Solutions Educational Trust's scholarships, fee concessions, and student development programs with a donation. See eligible payment methods and submit your donation details."
      path="/donate"
      keywords="donate educational trust, support scholarships Tamil Nadu, educational trust donation"
      jsonLd={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Donate', path: '/donate' },
      ])}
    />
  )

  if (submitted) {
    return (
      <>
        {seo}
        <DonationThankYou data={submitted} />
      </>
    )
  }

  return (
    <div className="bg-white">
      {seo}
      <DonationHero />
      <div data-reveal><DonationQrSection /></div>
      <div data-reveal>
        <DonationForm form={form} errors={errors} onChange={handleChange} submitting={submitting} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
