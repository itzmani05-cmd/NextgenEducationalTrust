import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import { lookupApplication } from '../utils/api.js'
import StatusLookupForm from '../components/status-check/StatusLookupForm.jsx'
import ApplicationSummaryCard from '../components/status-check/ApplicationSummaryCard.jsx'
import ConcessionCard from '../components/status-check/ConcessionCard.jsx'
import PaymentCard from '../components/status-check/PaymentCard.jsx'
import DocumentsSection from '../components/status-check/DocumentsSection.jsx'

export default function StatusCheck() {
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runLookup = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await lookupApplication(mobile, email)
      setApp(result)
    } catch (err) {
      setError(err.message || 'Failed to look up application.')
      setApp(null)
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => lookupApplication(mobile, email).then(setApp)

  return (
    <div className="bg-brand-surface min-h-screen">
      <SEO
        title="Check Application Status | NextGen Solutions Educational Trust"
        description="Look up the status of your NextGen Solutions Educational Trust scholarship application."
        path="/status"
        noindex
      />
      <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
        <StatusLookupForm
          mobile={mobile}
          setMobile={setMobile}
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          onSubmit={runLookup}
        />

        {app && (
          <div className="space-y-6">
            <ApplicationSummaryCard app={app} />
            {app.concession && <ConcessionCard concession={app.concession} />}
            {app.payment && <PaymentCard payment={app.payment} />}
            <DocumentsSection app={app} onReupload={refresh} />
          </div>
        )}
      </div>
    </div>
  )
}
