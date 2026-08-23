import Section from './Section.jsx'
import Row from './Row.jsx'
import { enOnly } from '../../../i18n/bilingual.js'

const SOCIAL_CATEGORY_LABELS = { 'SC/ST': 'Scheduled Caste', 'Not SC/ST': 'Not Scheduled Caste' }

export default function StudentInfoSections({ app }) {
  return (
    <>
      <Section title={enOnly('admin.detail.studentDetails')}>
        <Row label={enOnly('admin.detail.fields.courseApplied')} value={app.examName || app.examCategory} />
        <Row label={enOnly('admin.detail.fields.fullName')} value={app.fullName} />
        <Row label={enOnly('admin.detail.fields.dob')} value={app.dob} />
        <Row label={enOnly('admin.detail.fields.gender')} value={app.gender} />
        <Row label={enOnly('admin.detail.fields.mobile')} value={app.mobile} />
        <Row label={enOnly('admin.detail.fields.email')} value={app.email} />
        <Row label={enOnly('admin.detail.fields.address')} value={app.address} />
        <Row label={enOnly('admin.detail.fields.district')} value={app.district} />
      </Section>

      <Section title={enOnly('admin.detail.family')}>
        <Row label={enOnly('admin.detail.fields.fatherName')} value={app.fatherName} />
        <Row label={enOnly('admin.detail.fields.fatherOccupation')} value={app.fatherOccupation} />
        <Row label={enOnly('admin.detail.fields.fatherContact')} value={app.fatherContact} />
        <Row label={enOnly('admin.detail.fields.motherName')} value={app.motherName} />
        <Row label={enOnly('admin.detail.fields.motherOccupation')} value={app.motherOccupation} />
        <Row label={enOnly('admin.detail.fields.motherContact')} value={app.motherContact} />
        <Row label={enOnly('admin.detail.fields.guardianName')} value={app.guardianName} />
        <Row label={enOnly('admin.detail.fields.guardianRelation')} value={app.guardianRelation} />
        <Row label={enOnly('admin.detail.fields.guardianContact')} value={app.guardianContact} />
        <Row label={enOnly('admin.detail.fields.parentStatus')} value={app.parentStatus} />
        <Row label={enOnly('admin.detail.fields.bothParentsDeceased')} value={app.bothParentsDeceased} />
        <Row label={enOnly('admin.detail.fields.singleParentSupported')} value={app.singleParent} />
        <Row label={enOnly('admin.detail.fields.supportingParent')} value={app.supportingParent} />
      </Section>

      <Section title={enOnly('admin.detail.financial')}>
        <Row label={enOnly('admin.detail.fields.annualIncome')} value={app.annualIncome} />
        <Row label={enOnly('admin.detail.fields.expenseBearer')} value={app.expenseBearer} />
        <Row label={enOnly('admin.detail.fields.selfEarning')} value={app.selfEarning} />
        <Row label={enOnly('admin.detail.fields.employmentType')} value={app.employmentType} />
        <Row label={enOnly('admin.detail.fields.monthlyIncome')} value={app.monthlyIncome} />
      </Section>

      <Section title={enOnly('admin.detail.socialCategoryScholarship')}>
        <Row label={enOnly('admin.detail.fields.socialCategory')} value={SOCIAL_CATEGORY_LABELS[app.socialCategory] || app.socialCategory} />
        <Row label={enOnly('admin.detail.fields.existingScholarship')} value={app.existingScholarship} />
        <Row label={enOnly('admin.detail.fields.scholarshipName')} value={app.scholarshipName} />
        <Row label={enOnly('admin.detail.fields.scholarshipProvider')} value={app.scholarshipProvider} />
        <Row label={enOnly('admin.detail.fields.scholarshipAmount')} value={app.scholarshipAmount} />
        <Row label={enOnly('admin.detail.fields.scholarshipYear')} value={app.scholarshipYear} />
      </Section>

      <Section title={enOnly('admin.detail.tenthStandard')}>
        <Row label={enOnly('admin.detail.fields.schoolName')} value={app.tenth?.schoolName} />
        <Row label={enOnly('admin.detail.fields.schoolType')} value={app.tenth?.schoolType} />
        <Row label={enOnly('admin.detail.fields.percentage')} value={app.tenth?.percentage} />
      </Section>

      <Section title={enOnly('admin.detail.twelfthStandard')}>
        <Row label={enOnly('admin.detail.fields.schoolName')} value={app.twelfth?.schoolName} />
        <Row label={enOnly('admin.detail.fields.schoolType')} value={app.twelfth?.schoolType} />
        <Row label={enOnly('admin.detail.fields.percentage')} value={app.twelfth?.percentage} />
      </Section>

      <Section title={enOnly('admin.detail.collegeInstitution')}>
        <Row label={enOnly('admin.detail.fields.currentlyStudying')} value={app.college?.currentlyStudying} />
        <Row label={enOnly('admin.detail.fields.name')} value={app.college?.name} />
        <Row label={enOnly('admin.detail.fields.type')} value={app.college?.type} />
        <Row label={enOnly('admin.detail.fields.address')} value={app.college?.address} />
        <Row label={enOnly('admin.detail.fields.rollNumber')} value={app.college?.rollNumber} />
        <Row label={enOnly('admin.detail.fields.degree')} value={app.college?.degree} />
        <Row label={enOnly('admin.detail.fields.branch')} value={app.college?.branch} />
        <Row label={enOnly('admin.detail.fields.year')} value={app.college?.year} />
        <Row label={enOnly('admin.detail.fields.semester')} value={app.college?.semester} />
        <Row label={enOnly('admin.detail.fields.academicYear')} value={app.college?.academicYear} />
        <Row label={enOnly('admin.detail.fields.expectedGraduation')} value={app.college?.gradYear} />
        <Row label={enOnly('admin.detail.fields.cgpaPercentage')} value={app.college?.cgpa} />
      </Section>

      <Section title={enOnly('admin.detail.academicMedium')}>
        <Row label={enOnly('admin.detail.fields.diploma')} value={app.hasDiploma} />
        <Row label={enOnly('admin.detail.fields.diplomaPercentage')} value={app.diplomaPercentage} />
        <Row label={enOnly('admin.detail.fields.latestAcademicPercentage')} value={app.latestAcademicPercentage} />
        <Row label={enOnly('admin.detail.fields.pstm')} value={app.tamilMediumTill12} />
      </Section>
    </>
  )
}
