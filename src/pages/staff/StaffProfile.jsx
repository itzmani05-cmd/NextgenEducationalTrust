import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { UserRound, GraduationCap, Landmark, FileCheck2, CheckCircle2 } from 'lucide-react'
import { getMyProfile, updateMyProfile, uploadMyDocument, deleteMyDocument, getMyDocumentSignedUrl } from '../../utils/staffApi.js'
import { GENDERS, QUALIFICATIONS } from '../../components/staff/staffConstants.js'
import { staffInputClasses } from '../../components/staff/StaffAuthCard.jsx'
import StaffDocumentsEditor from '../../components/staff/StaffDocumentsEditor.jsx'
import { formatINR } from '../../components/admin/expenses/expenseConstants.js'

const FIELDS = [
  'phone', 'email', 'dob', 'gender', 'address',
  'qualification', 'degree', 'institution', 'passingYear', 'experienceYears', 'subjects',
  'bankAccountName', 'bankAccountNumber', 'bankIfsc', 'bankName', 'pan',
]

const toForm = (profile) => Object.fromEntries(FIELDS.map((f) => [f, profile?.[f] ?? '']))

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="bg-white border border-brand-border rounded-xl p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-brand-navy flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="font-bold text-brand-text">{title}</h2>
          {description && <p className="text-xs text-brand-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({ label, required, hint, span, children }) {
  return (
    <label className={`block ${span ? 'sm:col-span-2' : ''}`}>
      <span className="block text-xs font-semibold text-brand-text mb-1.5">
        {label}{required && <span className="text-brand-red"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-brand-muted mt-1">{hint}</span>}
    </label>
  )
}

export default function StaffProfile() {
  const { token, profile, setProfile, guard } = useOutletContext()
  const [form, setForm] = useState(() => toForm(profile))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (profile) setForm(toForm(profile))
  }, [profile?.id])

  if (!profile) return <p className="text-sm text-brand-muted">Loading your profile…</p>

  const set = (key, transform) => (e) => {
    const value = transform ? transform(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setMessage(null)
  }
  const upper = (v) => v.toUpperCase()
  const digits = (v) => v.replace(/\D/g, '')

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const updated = await guard(() => updateMyProfile(token, form))
      setProfile(updated)
      setMessage({ type: 'success', text: 'Your profile has been saved.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save your profile.' })
    } finally {
      setSaving(false)
    }
  }

  const refreshProfile = async () => setProfile(await guard(() => getMyProfile(token)))
  const { percent } = profile.completeness

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">My Profile</h1>
          <p className="text-sm text-brand-muted mt-0.5">Fields marked * are needed before the Trust can pay you.</p>
        </div>
        <div className="w-full sm:w-56">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-brand-text">Profile complete</span>
            <span className={percent === 100 ? 'text-green-700 font-semibold' : 'text-brand-muted'}>{percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-brand-border/60 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${percent === 100 ? 'bg-green-600' : 'bg-brand-navy'}`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-xl px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div><p className="text-xs text-brand-muted">Name</p><p className="font-semibold text-brand-text">{profile.name}</p></div>
        <div><p className="text-xs text-brand-muted">Staff ID</p><p className="font-semibold text-brand-text font-mono">{profile.staffCode}</p></div>
        <div><p className="text-xs text-brand-muted">Hourly rate</p><p className="font-semibold text-brand-text">{formatINR(profile.hourlyRate)} / hour</p></div>
      </div>

      <form onSubmit={handleSave} className="space-y-6" noValidate>
        <Section icon={UserRound} title="Personal Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mobile Number" required>
              <input type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={set('phone', digits)} placeholder="10-digit mobile" className={staffInputClasses} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={staffInputClasses} />
            </Field>
            <Field label="Date of Birth" required>
              <input type="date" value={form.dob} onChange={set('dob')} className={staffInputClasses} />
            </Field>
            <Field label="Gender" required>
              <select value={form.gender} onChange={set('gender')} className={staffInputClasses}>
                <option value="">Select…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Address" required span>
              <textarea rows={2} value={form.address} onChange={set('address')} maxLength={500} className={`${staffInputClasses} resize-none`} />
            </Field>
          </div>
        </Section>

        <Section icon={GraduationCap} title="Qualification & Experience">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Highest Qualification" required>
              <select value={form.qualification} onChange={set('qualification')} className={staffInputClasses}>
                <option value="">Select…</option>
                {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </Field>
            <Field label="Degree & Subject" required>
              <input type="text" value={form.degree} onChange={set('degree')} maxLength={120} placeholder="e.g. M.Sc Mathematics" className={staffInputClasses} />
            </Field>
            <Field label="College / University" required>
              <input type="text" value={form.institution} onChange={set('institution')} maxLength={200} className={staffInputClasses} />
            </Field>
            <Field label="Year of Passing" required>
              <input type="text" inputMode="numeric" maxLength={4} value={form.passingYear} onChange={set('passingYear', digits)} placeholder="e.g. 2019" className={staffInputClasses} />
            </Field>
            <Field label="Teaching / Work Experience (years)">
              <input type="text" inputMode="numeric" maxLength={2} value={form.experienceYears} onChange={set('experienceYears', digits)} placeholder="0" className={staffInputClasses} />
            </Field>
            <Field label="Subjects You Can Teach">
              <input type="text" value={form.subjects} onChange={set('subjects')} maxLength={300} placeholder="e.g. Maths, Physics" className={staffInputClasses} />
            </Field>
          </div>
        </Section>

        <Section icon={Landmark} title="Bank Details & PAN" description="Your honorarium is paid to this account.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Account Holder Name" required>
              <input type="text" value={form.bankAccountName} onChange={set('bankAccountName')} maxLength={120} className={staffInputClasses} />
            </Field>
            <Field label="Account Number" required>
              <input type="text" inputMode="numeric" maxLength={18} value={form.bankAccountNumber} onChange={set('bankAccountNumber', digits)} className={`${staffInputClasses} font-mono`} />
            </Field>
            <Field label="IFSC Code" required>
              <input type="text" maxLength={11} value={form.bankIfsc} onChange={set('bankIfsc', upper)} placeholder="e.g. SBIN0001234" className={`${staffInputClasses} font-mono uppercase`} />
            </Field>
            <Field label="Bank & Branch" required>
              <input type="text" value={form.bankName} onChange={set('bankName')} maxLength={120} placeholder="e.g. SBI, Udumalpet" className={staffInputClasses} />
            </Field>
            <Field label="PAN" required>
              <input type="text" maxLength={10} value={form.pan} onChange={set('pan', upper)} placeholder="ABCDE1234F" className={`${staffInputClasses} font-mono uppercase`} />
            </Field>
          </div>
        </Section>

        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-brand-border bg-white/95 backdrop-blur px-4 py-3 shadow-sm">
          {message && (
            <p className={`flex-1 text-sm flex items-center gap-1.5 ${message.type === 'success' ? 'text-green-700' : 'text-brand-red'}`}>
              {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />} {message.text}
            </p>
          )}
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Details'}
          </button>
        </div>
      </form>

      <Section icon={FileCheck2} title="Documents" description="PDF, JPG, PNG or WebP, up to 2MB each. Large photos are shrunk automatically. Documents save as soon as they upload.">
        <StaffDocumentsEditor
          documents={profile.documents}
          onUpload={async (kind, file) => {
            await guard(() => uploadMyDocument(token, kind, file))
            await refreshProfile()
          }}
          onDelete={async (docId) => {
            await guard(() => deleteMyDocument(token, docId))
            await refreshProfile()
          }}
          onView={async (docId) => {
            const { url } = await guard(() => getMyDocumentSignedUrl(token, docId))
            window.open(url, '_blank', 'noopener,noreferrer')
          }}
        />
      </Section>
    </div>
  )
}
