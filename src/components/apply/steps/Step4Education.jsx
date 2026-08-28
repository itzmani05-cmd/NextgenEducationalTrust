import SectionCard from '../SectionCard.jsx'
import TextField from '../fields/TextField.jsx'
import TextAreaField from '../fields/TextAreaField.jsx'
import SelectField from '../fields/SelectField.jsx'
import OptionPills from '../fields/OptionPills.jsx'
import YesNoRow from '../fields/YesNoRow.jsx'
import UploadField from '../fields/UploadField.jsx'
import { bi } from '../../../i18n/bilingual.js'

const YEAR_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `Year ${n}` }))
const SEMESTER_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
  value: String(n),
  label: `Semester ${n}`,
}))

export default function Step4Education({ data, setField }) {
  const schoolTypes = [
    { value: 'government', label: bi('step3.govtSchool') },
    { value: 'govt_aided', label: bi('step3.govtAided') },
    { value: 'private', label: bi('step3.private') },
    { value: 'other', label: bi('common.other') },
  ]

  const collegeTypes = [
    { value: 'government', label: bi('step3.collegeGovt') },
    { value: 'govt_aided', label: bi('step3.collegeGovtAided') },
    { value: 'private', label: bi('step3.collegePrivate') },
    { value: 'autonomous', label: bi('step3.collegeAutonomous') },
    { value: 'deemed', label: bi('step3.collegeDeemed') },
    { value: 'other', label: bi('common.other') },
  ]

  return (
    <>
      <SectionCard title={bi('step3.tenthTitle')}>
        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            label={bi('step3.schoolName')}
            required
            value={data.tenth.schoolName}
            onChange={(v) => setField('tenth.schoolName', v)}
          />
          <TextField
            label={bi('step3.percentage')}
            type="number"
            required
            value={data.tenth.percentage}
            onChange={(v) => setField('tenth.percentage', v)}
          />
        </div>
        <OptionPills
          label={bi('step3.studyWhere10Q')}
          required
          value={data.tenth.schoolType}
          onChange={(v) => setField('tenth.schoolType', v)}
          options={schoolTypes}
        />
        <UploadField
          label={bi('step3.tenthMarkSheet')}
          required
          file={data.tenth.markSheet}
          onChange={(f) => setField('tenth.markSheet', f)}
        />
      </SectionCard>

      <SectionCard title={bi('step3.twelfthTitle')}>
        <OptionPills
          label={bi('step3.postTenthQ')}
          required
          value={data.hasDiploma}
          onChange={(v) => setField('hasDiploma', v)}
          options={[
            { value: 'no', label: bi('step3.twelfthOption') },
            { value: 'yes', label: bi('step3.diplomaOption') },
          ]}
        />

        {data.hasDiploma === 'no' && (
          <div className="space-y-5 pt-1">
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label={bi('step3.schoolName')}
                required
                value={data.twelfth.schoolName}
                onChange={(v) => setField('twelfth.schoolName', v)}
              />
              <TextField
                label={bi('step3.percentage')}
                type="number"
                required
                value={data.twelfth.percentage}
                onChange={(v) => setField('twelfth.percentage', v)}
              />
            </div>
            <OptionPills
              label={bi('step3.studyWhere12Q')}
              required
              value={data.twelfth.schoolType}
              onChange={(v) => setField('twelfth.schoolType', v)}
              options={schoolTypes}
            />
            <UploadField
              label={bi('step3.twelfthMarkSheet')}
              required
              file={data.twelfth.markSheet}
              onChange={(f) => setField('twelfth.markSheet', f)}
            />
          </div>
        )}

        {data.hasDiploma === 'yes' && (
          <div className="space-y-5 pt-1">
            <TextField
              label={bi('step3.diplomaPercentage')}
              type="number"
              required
              value={data.diplomaPercentage}
              onChange={(v) => setField('diplomaPercentage', v)}
            />
            <UploadField
              label={bi('step3.diplomaMarkSheet')}
              required
              file={data.diplomaMarkSheet}
              onChange={(f) => setField('diplomaMarkSheet', f)}
            />
            <TextField
              label={bi('step3.latestAcademicPercentage')}
              type="number"
              required
              value={data.latestAcademicPercentage}
              onChange={(v) => setField('latestAcademicPercentage', v)}
              helper={bi('step3.latestAcademicHelper')}
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title={bi('step3.collegeTitle')}>
        <YesNoRow
          question={bi('step3.studyingInCollegeQ')}
          value={data.college.currentlyStudying}
          onChange={(v) => setField('college.currentlyStudying', v)}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            label={data.college.currentlyStudying === 'no' ? bi('step3.pastCollegeName') : bi('step3.collegeName')}
            required
            value={data.college.name}
            onChange={(v) => setField('college.name', v)}
          />
          <TextField
            label={bi('step3.rollNumber')}
            required
            value={data.college.rollNumber}
            onChange={(v) => setField('college.rollNumber', v)}
          />
        </div>

        <OptionPills
          label={bi('step3.institutionType')}
          required
          value={data.college.type}
          onChange={(v) => setField('college.type', v)}
          options={collegeTypes}
        />

        <TextAreaField
          label={bi('step3.collegeAddress')}
          required
          value={data.college.address}
          onChange={(v) => setField('college.address', v)}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            label={bi('step3.degree')}
            required
            value={data.college.degree}
            onChange={(v) => setField('college.degree', v)}
          />
          <TextField
            label={bi('step3.branch')}
            value={data.college.branch}
            onChange={(v) => setField('college.branch', v)}
          />
        </div>

        {data.college.currentlyStudying === 'yes' && (
          <div className="grid sm:grid-cols-2 gap-5">
            <SelectField
              label={bi('step3.currentYear')}
              required
              value={data.college.year}
              onChange={(v) => setField('college.year', v)}
              options={YEAR_OPTIONS}
              placeholder={bi('common.selectPlaceholder')}
            />
            <SelectField
              label={bi('step3.currentSemester')}
              value={data.college.semester}
              onChange={(v) => setField('college.semester', v)}
              options={SEMESTER_OPTIONS}
              placeholder={bi('common.selectPlaceholder')}
            />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            label={bi('step3.academicYear')}
            required
            placeholder={bi('step3.academicYearPlaceholder')}
            value={data.college.academicYear}
            onChange={(v) => setField('college.academicYear', v)}
          />
          <TextField
            label={data.college.currentlyStudying === 'no' ? bi('step3.pastGradYear') : bi('step3.gradYear')}
            value={data.college.gradYear}
            onChange={(v) => setField('college.gradYear', v)}
          />
        </div>

        <TextField
          label={data.college.currentlyStudying === 'no' ? bi('step3.pastCgpa') : bi('step3.cgpa')}
          required
          value={data.college.cgpa}
          onChange={(v) => setField('college.cgpa', v)}
        />

        <UploadField
          label={bi('step3.collegeMarkSheet')}
          required
          file={data.college.markSheet}
          onChange={(f) => setField('college.markSheet', f)}
        />
      </SectionCard>

      <SectionCard title={bi('step2.scholarshipTitle')} description={bi('step2.scholarshipMovedDesc')}>
        <YesNoRow
          question={bi('step2.existingScholarshipQ')}
          value={data.existingScholarship}
          onChange={(v) => setField('existingScholarship', v)}
        />

        {data.existingScholarship === 'yes' && (
          <div className="space-y-5 pt-1 pb-4">
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label={bi('step2.scholarshipName')}
                required
                value={data.scholarshipName}
                onChange={(v) => setField('scholarshipName', v)}
              />
              <TextField
                label={bi('step2.scholarshipProvider')}
                required
                value={data.scholarshipProvider}
                onChange={(v) => setField('scholarshipProvider', v)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label={bi('step2.scholarshipAmount')}
                type="number"
                value={data.scholarshipAmount}
                onChange={(v) => setField('scholarshipAmount', v)}
              />
              <TextField
                label={bi('step2.scholarshipYear')}
                placeholder={bi('step2.scholarshipYearPlaceholder')}
                value={data.scholarshipYear}
                onChange={(v) => setField('scholarshipYear', v)}
              />
            </div>
            <UploadField
              label={bi('step2.scholarshipDoc')}
              helper={bi('step2.scholarshipDocHelper')}
              file={data.scholarshipDoc}
              onChange={(f) => setField('scholarshipDoc', f)}
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title={bi('step3.mediumTitle')}>
        <YesNoRow
          question={bi('step3.pstmQ')}
          value={data.tamilMediumTill12}
          onChange={(v) => setField('tamilMediumTill12', v)}
        />

        {data.tamilMediumTill12 === 'yes' && (
          <UploadField
            label={bi('step3.tamilEvidence')}
            required
            helper={bi('step3.tamilEvidenceHelper')}
            file={data.tamilMediumEvidence}
            onChange={(f) => setField('tamilMediumEvidence', f)}
          />
        )}
      </SectionCard>
    </>
  )
}
