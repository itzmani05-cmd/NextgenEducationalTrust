import SectionCard from '../SectionCard.jsx'
import TextField from '../fields/TextField.jsx'
import SelectField from '../fields/SelectField.jsx'
import OptionPills from '../fields/OptionPills.jsx'
import { bi } from '../../../i18n/bilingual.js'

const DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
  'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
  'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar',
]

const SDP_ABBR = (
  <abbr title={bi('step1.sdpFullForm')} className="underline decoration-dotted decoration-brand-muted cursor-help">
    SDP
  </abbr>
)

const COURSE_OPTIONS = [
  { value: 'state_govt', exam: bi('step1.courseStateGovt') },
  { value: 'central_govt', exam: bi('step1.courseCentralGovt') },
  { value: 'gate', exam: bi('step1.courseGate') },
]

export default function Step1Student({ data, setField }) {
  const districts = [...DISTRICTS, bi('common.other')].map((d) => ({ value: d, label: d }))

  const setCourse = (value) => {
    const opt = COURSE_OPTIONS.find((o) => o.value === value)
    setField('examCategory', value)
    setField('examName', opt ? opt.exam : '')
  }

  return (
    <SectionCard title={bi('step1.title')} description={bi('step1.description')}>
      <OptionPills
        label={bi('step1.courseApplied')}
        required
        value={data.examCategory}
        onChange={setCourse}
        options={COURSE_OPTIONS.map((o) => ({
          value: o.value,
          label: <>{SDP_ABBR} - {o.exam}</>,
        }))}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          label={`${bi('step1.fullName')} (${bi('step1.fullNameExample')})`}
          required
          value={data.fullName}
          onChange={(v) => setField('fullName', v)}
        />
        <TextField
          label={bi('step1.dob')}
          type="date"
          required
          value={data.dob}
          onChange={(v) => setField('dob', v)}
        />
      </div>

      <OptionPills
        label={bi('step1.gender')}
        required
        value={data.gender}
        onChange={(v) => setField('gender', v)}
        options={[
          { value: 'male', label: bi('step1.male') },
          { value: 'female', label: bi('step1.female') },
          { value: 'other', label: bi('common.other') },
        ]}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          label={bi('step1.mobile')}
          type="tel"
          required
          value={data.mobile}
          onChange={(v) => setField('mobile', v)}
        />
        <TextField
          label={bi('step1.email')}
          type="email"
          required
          value={data.email}
          onChange={(v) => setField('email', v)}
          readOnly
          helper={bi('step1.googleLocked')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          label={bi('step1.doorNo')}
          required
          value={data.address.doorNo}
          onChange={(v) => setField('address.doorNo', v)}
        />
        <TextField
          label={bi('step1.street')}
          required
          value={data.address.street}
          onChange={(v) => setField('address.street', v)}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <TextField
          label={bi('step1.place')}
          required
          value={data.address.place}
          onChange={(v) => setField('address.place', v)}
        />
        <TextField
          label={bi('step1.pincode')}
          required
          value={data.address.pincode}
          onChange={(v) => setField('address.pincode', v)}
        />
        <SelectField
          label={bi('step1.district')}
          required
          value={data.district}
          onChange={(v) => setField('district', v)}
          options={districts}
          placeholder={bi('common.selectPlaceholder')}
        />
      </div>
    </SectionCard>
  )
}
