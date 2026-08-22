import SectionCard from '../SectionCard.jsx'
import OptionPills from '../fields/OptionPills.jsx'
import YesNoRow from '../fields/YesNoRow.jsx'
import UploadField from '../fields/UploadField.jsx'

export default function Step6TamilMedium({ data, setField }) {
  return (
    <SectionCard title="Medium of Instruction">
      <OptionPills
        label="What was your medium of instruction?"
        required
        value={data.medium}
        onChange={(v) => setField('medium', v)}
        options={[
          { value: 'tamil', label: 'Tamil' },
          { value: 'english', label: 'English' },
          { value: 'other', label: 'Other' },
        ]}
      />

      <YesNoRow
        question="Did you study in Tamil Medium up to 10th / 12th?"
        value={data.tamilMediumTill12}
        onChange={(v) => setField('tamilMediumTill12', v)}
      />

      {data.tamilMediumTill12 === 'yes' && (
        <div className="space-y-4 pt-1 pb-4">
          <UploadField
            label="Tamil Medium Evidence"
            required
            helper="Bonafide certificate or mark sheet indicating medium of instruction"
            file={data.tamilMediumEvidence}
            onChange={(f) => setField('tamilMediumEvidence', f)}
          />
        </div>
      )}
    </SectionCard>
  )
}
