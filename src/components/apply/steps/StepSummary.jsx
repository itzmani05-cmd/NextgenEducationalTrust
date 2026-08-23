import { Pencil } from 'lucide-react'
import SectionCard from '../SectionCard.jsx'
import { bi, enOnly } from '../../../i18n/bilingual.js'

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-brand-border last:border-0">
      <span className="text-sm text-brand-muted">{label}</span>
      <span className="text-sm font-medium text-brand-text text-right">{value}</span>
    </div>
  )
}

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline shrink-0"
    >
      <Pencil className="w-3.5 h-3.5" />
      {enOnly('common.edit')}
    </button>
  )
}

const INCOME_LABELS = {
  upto_1_5: bi('step2.incomeTier1'),
  '1_5_to_3': bi('step2.incomeTier2'),
  '3_to_5': bi('step2.incomeTier3'),
  above_5: bi('step2.incomeTier4'),
}
const YES_NO_LABELS = { yes: bi('common.yes'), no: bi('common.no') }

export default function StepSummary({ data, goToStep }) {
  return (
    <>
      <SectionCard title={enOnly('step6.title')} description={enOnly('step6.description')}>
        <div>
          <Row label={bi('step1.fullName')} value={data.fullName} />
          <Row label={bi('step1.mobile')} value={data.mobile} />
          <Row label={bi('step1.email')} value={data.email} />
          <Row label={bi('step1.district')} value={data.district} />
        </div>
      </SectionCard>

      <SectionCard title={bi('step6.studentDetails')} action={<EditButton onClick={() => goToStep(1)} />}>
        <div>
          <Row label={bi('step1.gender')} value={data.gender} />
          <Row label={bi('step1.dob')} value={data.dob} />
        </div>
      </SectionCard>

      <SectionCard title={bi('step6.familyFinancial')} action={<EditButton onClick={() => goToStep(2)} />}>
        <div>
          <Row label={bi('step2.parentStatus')} value={data.parentStatus} />
          <Row label={bi('step6.bothDeceasedLabel')} value={YES_NO_LABELS[data.bothParentsDeceased]} />
          <Row label={bi('step6.singleParentLabel')} value={YES_NO_LABELS[data.singleParent]} />
          <Row label={bi('step2.incomeTitle')} value={INCOME_LABELS[data.annualIncome]} />
          <Row label={bi('step2.socialCategoryTitle')} value={data.socialCategory} />
          <Row label={bi('step2.scholarshipTitle')} value={YES_NO_LABELS[data.existingScholarship]} />
        </div>
      </SectionCard>

      <SectionCard title={bi('step6.education')} action={<EditButton onClick={() => goToStep(3)} />}>
        <div>
          <Row label={bi('step3.studyingInCollegeQ')} value={YES_NO_LABELS[data.college.currentlyStudying]} />
          <Row label={bi('step3.collegeName')} value={data.college.name} />
          <Row label={bi('step3.degree')} value={data.college.degree} />
          <Row label={bi('step3.currentYear')} value={data.college.year} />
          <Row label={bi('step3.mediumTitle')} value={YES_NO_LABELS[data.tamilMediumTill12]} />
        </div>
      </SectionCard>

      <SectionCard title={bi('step6.documents')} action={<EditButton onClick={() => goToStep(4)} />}>
        <p className="text-sm text-brand-muted">{bi('step6.documentsReview')}</p>
      </SectionCard>
    </>
  )
}
