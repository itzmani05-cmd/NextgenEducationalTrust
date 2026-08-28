import SectionCard from '../SectionCard.jsx'
import UploadField from '../fields/UploadField.jsx'
import { getPath } from '../../../utils/objectPath.js'
import { BASIC_DOCUMENTS, getConditionalDocuments } from '../../../utils/documentChecklist.js'
import { bi } from '../../../i18n/bilingual.js'

export default function Step9Documents({ data, setField }) {
  const conditionalDocs = getConditionalDocuments(data)

  const renderDocs = (docs) =>
    docs.map((doc) => (
      <UploadField
        key={doc.key}
        label={bi(doc.labelKey)}
        required={doc.required !== false}
        file={getPath(data, doc.key)}
        onChange={(f) => setField(doc.key, f)}
      />
    ))

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
