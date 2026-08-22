import SectionCard from '../SectionCard.jsx'
import TextField from '../fields/TextField.jsx'
import YesNoRow from '../fields/YesNoRow.jsx'
import UploadField from '../fields/UploadField.jsx'
import { academicBonus } from '../../../utils/scholarshipCalc.js'

function StatTile({ label, value }) {
  return (
    <div className="bg-brand-surface rounded-lg p-4 text-center">
      <p className="text-xs text-brand-muted mb-1">{label}</p>
      <p className="text-lg font-bold text-brand-navy">{value ? `${value}%` : '—'}</p>
    </div>
  )
}

export default function Step5Academic({ data, setField }) {
  const bonus = academicBonus(data.latestAcademicPercentage)

  return (
    <SectionCard
      title="Academic Performance"
      description="We've carried over your percentages from the previous step. No manual calculation needed — your score is worked out automatically."
    >
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="10th %" value={data.tenth.percentage} />
        <StatTile label="12th %" value={data.twelfth.percentage} />
        <StatTile label="College Latest %" value={data.college.latestPercentage} />
      </div>

      <YesNoRow
        question="Do you hold a Diploma qualification?"
        value={data.hasDiploma}
        onChange={(v) => setField('hasDiploma', v)}
      />

      {data.hasDiploma === 'yes' && (
        <div className="space-y-5 pt-1 pb-4">
          <TextField
            label="Diploma Percentage"
            type="number"
            required
            value={data.diplomaPercentage}
            onChange={(v) => setField('diplomaPercentage', v)}
          />
          <UploadField
            label="Diploma Mark Sheet"
            required
            file={data.diplomaMarkSheet}
            onChange={(f) => setField('diplomaMarkSheet', f)}
          />
        </div>
      )}

      <TextField
        label="Latest Academic Percentage"
        type="number"
        required
        value={data.latestAcademicPercentage}
        onChange={(v) => setField('latestAcademicPercentage', v)}
        helper="Your most recent completed percentage (e.g. current semester or latest year) — this is the figure used for scoring below."
      />

      <div className="bg-brand-surface border border-brand-border rounded-lg p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-text">Automatic Academic Score</p>
          <p className="text-xs text-brand-muted mt-0.5">
            ≥80% → +5% &nbsp;·&nbsp; 60–79.99% → +3% &nbsp;·&nbsp; 50–59.99% → +1% &nbsp;·&nbsp; &lt;50% → 0%
          </p>
        </div>
        <p className="text-2xl font-bold text-brand-navy shrink-0">+{bonus}%</p>
      </div>
    </SectionCard>
  )
}
