import { useState } from 'react'
import { FileText, Eye, AlertCircle, CheckCircle2 } from 'lucide-react'
import { STAFF_DOCUMENT_KINDS } from '../../staff/staffConstants.js'

const SECTIONS = [
  {
    title: 'Personal',
    fields: [['Mobile', 'phone'], ['Email', 'email'], ['Date of Birth', 'dob'], ['Gender', 'gender'], ['Address', 'address', true]],
  },
  {
    title: 'Qualification & Experience',
    fields: [
      ['Highest Qualification', 'qualification'], ['Degree & Subject', 'degree'], ['College / University', 'institution'],
      ['Year of Passing', 'passingYear'], ['Experience', 'experienceYears'], ['Subjects', 'subjects'],
    ],
  },
  {
    title: 'Bank & PAN',
    fields: [['Account Holder', 'bankAccountName'], ['Account Number', 'bankAccountNumber'], ['IFSC', 'bankIfsc'], ['Bank & Branch', 'bankName'], ['PAN', 'pan']],
  },
]

const MONO = new Set(['bankAccountNumber', 'bankIfsc', 'pan'])

function display(key, value) {
  if (value === null || value === undefined || value === '') return null
  if (key === 'experienceYears') return `${value} ${Number(value) === 1 ? 'year' : 'years'}`
  if (key === 'dob') {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  return String(value)
}

export default function StaffProfilePanel({ staff, onViewDocument }) {
  const [openingId, setOpeningId] = useState(null)
  const { missingDocuments } = staff.completeness

  const view = async (docId) => {
    setOpeningId(docId)
    try {
      await onViewDocument(docId)
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-white border border-brand-border rounded-xl p-5">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">{section.title}</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {section.fields.map(([label, key, wide]) => {
                const value = display(key, staff[key])
                return (
                  <div key={key} className={wide ? 'sm:col-span-2' : ''}>
                    <dt className="text-xs text-brand-muted">{label}</dt>
                    <dd className={`text-sm mt-0.5 ${value ? 'text-brand-text font-medium' : 'text-brand-muted italic'} ${value && MONO.has(key) ? 'font-mono' : ''}`}>
                      {value || 'Not provided'}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        ))}
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-5 h-fit">
        <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Documents</h3>
        {missingDocuments.length > 0 && (
          <div className="mb-4 flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{missingDocuments.length} required {missingDocuments.length === 1 ? 'document is' : 'documents are'} missing.</span>
          </div>
        )}
        <ul className="space-y-3">
          {STAFF_DOCUMENT_KINDS.map((kind) => {
            const docs = staff.documents.filter((d) => d.kind === kind.key)
            return (
              <li key={kind.key}>
                <p className="text-sm font-semibold text-brand-text flex items-center gap-1.5">
                  {docs.length ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <span className={`w-4 h-4 rounded-full border-2 ${kind.required ? 'border-amber-400' : 'border-brand-border'}`} />}
                  {kind.label}
                  {!kind.required && <span className="text-xs font-normal text-brand-muted">(optional)</span>}
                </p>
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => view(doc.id)}
                    disabled={openingId === doc.id}
                    className="mt-1.5 ml-5.5 w-[calc(100%-1.375rem)] flex items-center gap-2 rounded-lg bg-brand-surface/70 px-3 py-1.5 text-xs text-left hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-navy shrink-0" />
                    <span className="flex-1 truncate text-brand-text">{doc.fileName}</span>
                    <Eye className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                  </button>
                ))}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
