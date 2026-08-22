import SectionCard from '../SectionCard.jsx'
import TextField from '../fields/TextField.jsx'
import SelectField from '../fields/SelectField.jsx'
import YesNoRow from '../fields/YesNoRow.jsx'
import OptionPills from '../fields/OptionPills.jsx'
import UploadField from '../fields/UploadField.jsx'
import IncomeTierGrid from '../fields/IncomeTierGrid.jsx'
import { bi } from '../../../i18n/bilingual.js'

export default function Step2Family({ data, setField }) {
  const isScSt = data.socialCategory === 'SC' || data.socialCategory === 'ST' || data.socialCategory === 'SC(A)'

  const parentStatusOptions = [
    { value: 'both_alive', label: bi('step2.parentStatusBothAlive') },
    { value: 'single_parent', label: bi('step2.parentStatusSingle') },
    { value: 'orphan', label: bi('step2.parentStatusOrphan') },
    { value: 'guardian_care', label: bi('step2.parentStatusGuardian') },
  ]

  // The circumstances section below is driven entirely by this choice, so
  // derive the underlying yes/no fields (used by scholarship-category
  // calculation) instead of asking the applicant the same thing twice.
  const handleParentStatusChange = (v) => {
    setField('parentStatus', v)
    setField('bothParentsDeceased', v === 'orphan' ? 'yes' : 'no')
    setField('singleParent', v === 'single_parent' ? 'yes' : 'no')
  }

  return (
    <>
      <SectionCard title={bi('step2.familyTitle')}>
        <div className="grid sm:grid-cols-3 gap-5">
          <TextField label={bi('step2.fatherName')} value={data.fatherName} onChange={(v) => setField('fatherName', v)} />
          <TextField label={bi('step2.fatherOccupation')} value={data.fatherOccupation} onChange={(v) => setField('fatherOccupation', v)} />
          <TextField label={bi('step2.fatherContact')} type="tel" value={data.fatherContact} onChange={(v) => setField('fatherContact', v)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <TextField label={bi('step2.motherName')} value={data.motherName} onChange={(v) => setField('motherName', v)} />
          <TextField label={bi('step2.motherOccupation')} value={data.motherOccupation} onChange={(v) => setField('motherOccupation', v)} />
          <TextField label={bi('step2.motherContact')} type="tel" value={data.motherContact} onChange={(v) => setField('motherContact', v)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <TextField label={bi('step2.guardianName')} helper={bi('step2.guardianNameHelper')} value={data.guardianName} onChange={(v) => setField('guardianName', v)} />
          <TextField label={bi('step2.guardianRelation')} value={data.guardianRelation} onChange={(v) => setField('guardianRelation', v)} />
          <TextField label={bi('step2.guardianContact')} type="tel" value={data.guardianContact} onChange={(v) => setField('guardianContact', v)} />
        </div>
        <SelectField
          label={bi('step2.parentStatus')}
          required
          value={data.parentStatus}
          onChange={handleParentStatusChange}
          options={parentStatusOptions}
          placeholder={bi('common.selectPlaceholder')}
        />
      </SectionCard>

      <SectionCard title={bi('step2.circumstancesTitle')} description={bi('step2.circumstancesDesc')}>
        {data.parentStatus === 'orphan' && (
          <div className="space-y-4">
            <p className="text-sm text-brand-muted">{bi('step2.orphanNotice')}</p>
            <UploadField
              label={bi('step2.fatherDeathCert')}
              required
              file={data.fatherDeathCert}
              onChange={(f) => setField('fatherDeathCert', f)}
            />
            <UploadField
              label={bi('step2.motherDeathCert')}
              required
              file={data.motherDeathCert}
              onChange={(f) => setField('motherDeathCert', f)}
            />
          </div>
        )}

        {data.parentStatus === 'single_parent' && (
          <div className="space-y-5">
            <p className="text-sm text-brand-muted">{bi('step2.singleParentNotice')}</p>
            <OptionPills
              label={bi('step2.supportingParent')}
              required
              value={data.supportingParent}
              onChange={(v) => setField('supportingParent', v)}
              options={[
                { value: 'father', label: bi('step2.supportingParentFather') },
                { value: 'mother', label: bi('step2.supportingParentMother') },
                { value: 'guardian', label: bi('step2.supportingParentGuardian') },
              ]}
            />
            <UploadField
              label={bi('step2.supportingDocument')}
              required
              helper={bi('step2.supportingDocumentHelper')}
              file={data.supportingDocument}
              onChange={(f) => setField('supportingDocument', f)}
            />
          </div>
        )}

        {(data.parentStatus === 'both_alive' || data.parentStatus === 'guardian_care') && (
          <p className="text-sm text-brand-muted">{bi('step2.noExtraDocsNotice')}</p>
        )}

        {!data.parentStatus && (
          <p className="text-sm text-brand-muted">{bi('step2.selectStatusNotice')}</p>
        )}
      </SectionCard>

      <SectionCard title={bi('step2.incomeTitle')} description={bi('step2.incomeDesc')}>
        <IncomeTierGrid value={data.annualIncome} onChange={(v) => setField('annualIncome', v)} />
        <UploadField
          label={bi('step2.incomeCertificate')}
          required
          file={data.incomeCertificate}
          onChange={(f) => setField('incomeCertificate', f)}
        />
      </SectionCard>

      <SectionCard title={bi('step2.expensesTitle')}>
        <OptionPills
          label={bi('step2.expenseBearerQ')}
          required
          value={data.expenseBearer}
          onChange={(v) => setField('expenseBearer', v)}
          options={[
            { value: 'parents_full', label: bi('step2.expenseParentsFull') },
            { value: 'parents_partial', label: bi('step2.expenseParentsPartial') },
            { value: 'self', label: bi('step2.expenseSelf') },
            { value: 'shared', label: bi('step2.expenseShared') },
            { value: 'other', label: bi('common.other') },
          ]}
        />
      </SectionCard>

      <SectionCard title={bi('step2.independenceTitle')}>
        <YesNoRow
          question={bi('step2.selfEarningQ')}
          value={data.selfEarning}
          onChange={(v) => setField('selfEarning', v)}
        />

        {data.selfEarning === 'yes' && (
          <div className="space-y-5 pt-1 pb-4">
            <OptionPills
              label={bi('step2.employmentType')}
              required
              value={data.employmentType}
              onChange={(v) => setField('employmentType', v)}
              options={[
                { value: 'full_time', label: bi('step2.employmentFullTime') },
                { value: 'part_time', label: bi('step2.employmentPartTime') },
                { value: 'self_employed', label: bi('step2.employmentSelfEmployed') },
                { value: 'freelance', label: bi('step2.employmentFreelance') },
                { value: 'other', label: bi('common.other') },
              ]}
            />
            <TextField
              label={bi('step2.monthlyIncome')}
              type="number"
              required
              value={data.monthlyIncome}
              onChange={(v) => setField('monthlyIncome', v)}
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title={bi('step2.socialCategoryTitle')}>
        <OptionPills
          label={bi('step2.socialCategoryQ')}
          required
          value={data.socialCategory}
          onChange={(v) => setField('socialCategory', v)}
          options={[
            { value: 'SC', label: bi('step2.sc') },
            { value: 'ST', label: bi('step2.st') },
            { value: 'SC(A)', label: bi('step2.scA') },
            { value: 'No', label: bi('step2.no') },
          ]}
        />

        {isScSt && (
          <div className="pt-1 pb-4">
            <UploadField
              label={bi('step2.communityCertificate')}
              required
              file={data.communityCertificate}
              onChange={(f) => setField('communityCertificate', f)}
            />
          </div>
        )}
      </SectionCard>
    </>
  )
}
