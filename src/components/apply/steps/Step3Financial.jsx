import SectionCard from '../SectionCard.jsx'
import TextField from '../fields/TextField.jsx'
import YesNoRow from '../fields/YesNoRow.jsx'
import OptionPills from '../fields/OptionPills.jsx'
import UploadField from '../fields/UploadField.jsx'
import IncomeTierGrid from '../fields/IncomeTierGrid.jsx'

export default function Step3Financial({ data, setField }) {
  return (
    <>
      <SectionCard
        title="Annual Household Income"
        description="Select the tier that reflects your combined household income for the previous financial year."
      >
        <IncomeTierGrid value={data.annualIncome} onChange={(v) => setField('annualIncome', v)} />
        <UploadField
          label="Government-issued Income Certificate"
          required
          file={data.incomeCertificate}
          onChange={(f) => setField('incomeCertificate', f)}
        />
      </SectionCard>

      <SectionCard title="Educational Expenses">
        <OptionPills
          label="Who primarily bears your educational/coaching expenses?"
          required
          value={data.expenseBearer}
          onChange={(v) => setField('expenseBearer', v)}
          options={[
            { value: 'parents_full', label: 'Parents / Guardian fully' },
            { value: 'parents_partial', label: 'Parents / Guardian partially' },
            { value: 'self', label: 'I bear my expenses myself' },
            { value: 'shared', label: 'I and my family share expenses' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </SectionCard>

      <SectionCard title="Financial Independence">
        <YesNoRow
          question="Are you currently earning an income to support your education or family?"
          value={data.selfEarning}
          onChange={(v) => setField('selfEarning', v)}
        />

        {data.selfEarning === 'yes' && (
          <div className="space-y-5 pt-1 pb-4">
            <OptionPills
              label="Employment Type"
              required
              value={data.employmentType}
              onChange={(v) => setField('employmentType', v)}
              options={[
                { value: 'full_time', label: 'Full-time' },
                { value: 'part_time', label: 'Part-time' },
                { value: 'self_employed', label: 'Self-employed' },
                { value: 'freelance', label: 'Freelance / Gig' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <TextField
              label="Approximate Monthly Income (₹)"
              type="number"
              required
              value={data.monthlyIncome}
              onChange={(v) => setField('monthlyIncome', v)}
            />
            <UploadField
              label="Supporting Document"
              required
              helper="Salary slip, bank statement, or similar"
              file={data.selfIncomeDoc}
              onChange={(f) => setField('selfIncomeDoc', f)}
            />

            <YesNoRow
              question="Do you financially support any family member from your income?"
              value={data.supportsDependents}
              onChange={(v) => setField('supportsDependents', v)}
            />

            {data.supportsDependents === 'yes' && (
              <div className="space-y-4">
                <TextField
                  label="Number of Dependents"
                  type="number"
                  required
                  value={data.numDependents}
                  onChange={(v) => setField('numDependents', v)}
                />
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </>
  )
}
