import { useState } from 'react'
import SectionCard from '../SectionCard.jsx'
import UploadField from '../fields/UploadField.jsx'
import { uploadDocument } from '../../../utils/api.js'
import { BASIC_DOCUMENTS, getConditionalDocuments } from '../../../utils/documentChecklist.js'
import { bi } from '../../../i18n/bilingual.js'

// Each document uploads on selection, one request per file (see
// utils/api.js uploadDocument) — the application record already exists by
// the time this step is reachable (created when the wizard was locked), so
// a document picked here is durably saved immediately instead of waiting on
// a final bulk submit. That's what keeps it from disappearing on refresh:
// `documentPresence` (lifted to Apply.jsx) is what's already confirmed by
// the server, independent of this component's own in-session upload state.
export default function Step9Documents({ applicationId, docsSource, documentPresence, onUploaded }) {
  const [uploadState, setUploadState] = useState({}) // { [key]: { uploading, error, fileName } }
  const conditionalDocs = getConditionalDocuments(docsSource)

  const handleFile = async (doc, file) => {
    if (!file) return
    setUploadState((prev) => ({ ...prev, [doc.key]: { uploading: true, error: '', fileName: file.name } }))
    try {
      await uploadDocument(applicationId, doc.key, file)
      onUploaded(doc.key)
      setUploadState((prev) => ({ ...prev, [doc.key]: { uploading: false, error: '', fileName: file.name } }))
    } catch (err) {
      setUploadState((prev) => ({
        ...prev,
        [doc.key]: { uploading: false, error: err.message || 'Upload failed. Please try again.', fileName: file.name },
      }))
    }
  }

  const renderDocs = (docs) =>
    docs.map((doc) => {
      const state = uploadState[doc.key] || {}
      return (
        <UploadField
          key={doc.key}
          label={bi(doc.labelKey)}
          required={doc.required !== false}
          accept={doc.accept}
          fileName={state.fileName}
          alreadyUploaded={Boolean(documentPresence[doc.key])}
          uploading={state.uploading}
          error={state.error}
          onChange={(f) => handleFile(doc, f)}
        />
      )
    })

  return (
    <>
      <SectionCard title={bi('step5.basicTitle')} description={bi('step5.basicDesc')}>
        <div className="space-y-4">{renderDocs(BASIC_DOCUMENTS)}</div>
      </SectionCard>

      {conditionalDocs.length > 0 && (
        <SectionCard title={bi('step5.additionalTitle')} description={bi('step5.additionalDesc')}>
          <div className="space-y-4">{renderDocs(conditionalDocs)}</div>
        </SectionCard>
      )}
    </>
  )
}
