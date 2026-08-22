import SectionCard from '../SectionCard.jsx'
import TextField from '../fields/TextField.jsx'
import OptionPills from '../fields/OptionPills.jsx'
import YesNoRow from '../fields/YesNoRow.jsx'
import UploadField from '../fields/UploadField.jsx'

export default function Step7SocialCategory({ data, setField }) {
  const isScSt = data.socialCategory === 'SC' || data.socialCategory === 'ST'

  return (
    <>
      <SectionCard title="Social Category">
        <OptionPills
          label="Do you belong to SC/ST category?"
          required
          value={data.socialCategory}
          onChange={(v) => setField('socialCategory', v)}
          options={[
            { value: 'SC', label: 'SC' },
            { value: 'ST', label: 'ST' },
            { value: 'No', label: 'No' },
          ]}
        />

        {isScSt && (
          <div className="space-y-4 pt-1 pb-4">
            <UploadField
              label="Valid Community Certificate"
              required
              file={data.communityCertificate}
              onChange={(f) => setField('communityCertificate', f)}
            />
            <Callout title="SC/ST Concession" subtitle="Additional concession: +5% (subject to verification)" />
          </div>
        )}
      </SectionCard>

      <SectionCard title="Existing Scholarships / Financial Assistance">
        <YesNoRow
          question="Are you currently receiving any Government scholarship or other educational financial assistance?"
          value={data.existingScholarship}
          onChange={(v) => setField('existingScholarship', v)}
        />

        {data.existingScholarship === 'yes' && (
          <div className="space-y-5 pt-1 pb-4">
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label="Scholarship Name"
                required
                value={data.scholarshipName}
                onChange={(v) => setField('scholarshipName', v)}
              />
              <TextField
                label="Provider"
                required
                value={data.scholarshipProvider}
                onChange={(v) => setField('scholarshipProvider', v)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label="Amount (₹)"
                type="number"
                value={data.scholarshipAmount}
                onChange={(v) => setField('scholarshipAmount', v)}
              />
              <TextField
                label="Academic Year"
                placeholder="e.g. 2025-2026"
                value={data.scholarshipYear}
                onChange={(v) => setField('scholarshipYear', v)}
              />
            </div>
            <UploadField
              label="Supporting Document"
              required
              file={data.scholarshipDoc}
              onChange={(f) => setField('scholarshipDoc', f)}
            />
          </div>
        )}
      </SectionCard>
    </>
  )
}
