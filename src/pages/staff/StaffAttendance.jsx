import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CheckCheck, Search, XCircle } from 'lucide-react'
import { listAttendanceStudents, saveAttendance } from '../../utils/staffApi.js'
import { todayISO } from '../../components/staff/staffConstants.js'
import { staffInputClasses } from '../../components/staff/StaffAuthCard.jsx'
import { examKey, getExamMeta } from '../../components/admin/analytics/examConcession.js'

export default function StaffAttendance() {
  const { token, guard } = useOutletContext()
  const [date, setDate] = useState(todayISO)
  const [exam, setExam] = useState('')
  const [search, setSearch] = useState('')
  const [students, setStudents] = useState([])
  // applicationId -> true | false | null (null = not marked yet)
  const [marks, setMarks] = useState({})
  const [saved, setSaved] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setNotice('')
    guard(() => listAttendanceStudents(token, date))
      .then((res) => {
        if (cancelled) return
        setStudents(res.students)
        const initial = Object.fromEntries(res.students.map((s) => [s.id, s.present]))
        setMarks(initial)
        setSaved(initial)
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load students.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token, date, guard])

  const exams = useMemo(() => {
    const map = new Map()
    students.forEach((s) => {
      const key = examKey(s)
      if (!map.has(key)) map.set(key, { key, label: getExamMeta(key, s.examName).label, count: 0 })
      map.get(key).count += 1
    })
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
  }, [students])

  useEffect(() => {
    if (exams.length && !exams.some((e) => e.key === exam)) setExam(exams[0].key)
  }, [exams, exam])

  const q = search.trim().toLowerCase()
  const visible = students.filter(
    (s) => examKey(s) === exam && (!q || s.fullName?.toLowerCase().includes(q) || s.mobile?.includes(q)),
  )
  const inExam = students.filter((s) => examKey(s) === exam)
  const presentCount = inExam.filter((s) => marks[s.id] === true).length
  const absentCount = inExam.filter((s) => marks[s.id] === false).length
  const unmarkedCount = inExam.length - presentCount - absentCount
  const dirty = inExam.filter((s) => marks[s.id] !== saved[s.id] && marks[s.id] != null)

  const setMark = (id, value) => {
    setNotice('')
    setMarks((m) => ({ ...m, [id]: m[id] === value ? null : value }))
  }
  const markAll = (value) => {
    setNotice('')
    setMarks((m) => ({ ...m, ...Object.fromEntries(visible.map((s) => [s.id, value])) }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const records = dirty.map((s) => ({ applicationId: s.id, present: marks[s.id] }))
      await guard(() => saveAttendance(token, date, records))
      setSaved((prev) => ({ ...prev, ...Object.fromEntries(records.map((r) => [r.applicationId, r.present])) }))
      setNotice(`Attendance saved for ${records.length} ${records.length === 1 ? 'student' : 'students'}.`)
    } catch (err) {
      setError(err.message || 'Failed to save attendance.')
    } finally {
      setSaving(false)
    }
  }

  const toggleBase = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors'

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Student Attendance</h1>
          <p className="text-sm text-brand-muted mt-0.5">Pick the exam and date, then mark each student present or absent.</p>
        </div>
        <input type="date" value={date} max={todayISO()} onChange={(e) => e.target.value && setDate(e.target.value)} className={`${staffInputClasses} !w-auto`} aria-label="Date" />
      </div>

      {error && <div className="mb-4 bg-red-50 border border-brand-red/30 rounded-lg p-4 text-sm text-brand-red">{error}</div>}
      {notice && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">{notice}</div>}

      {loading ? (
        <p className="text-sm text-brand-muted">Loading…</p>
      ) : exams.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-xl px-5 py-10 text-center text-sm text-brand-muted">
          No enrolled students yet. Students appear here once their payment is approved.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4" role="tablist">
            {exams.map((e) => (
              <button
                key={e.key}
                type="button"
                role="tab"
                aria-selected={exam === e.key}
                onClick={() => setExam(e.key)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  exam === e.key ? 'bg-brand-navy border-brand-navy text-white' : 'bg-white border-brand-border text-brand-muted hover:text-brand-text'
                }`}
              >
                {e.label} <span className="opacity-70">· {e.count}</span>
              </button>
            ))}
          </div>

          <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-brand-border flex flex-wrap items-center justify-between gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or mobile" className={`${staffInputClasses} !w-64 !pl-9`} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-green-700 font-semibold">{presentCount} present</span>
                <span className="text-brand-red font-semibold">{absentCount} absent</span>
                <span className="text-brand-muted">{unmarkedCount} not marked</span>
                <button type="button" onClick={() => markAll(true)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-border font-semibold text-brand-text hover:border-brand-navy">
                  <CheckCheck className="w-3.5 h-3.5" /> All present
                </button>
                <button type="button" onClick={() => markAll(false)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-border font-semibold text-brand-text hover:border-brand-navy">
                  <XCircle className="w-3.5 h-3.5" /> All absent
                </button>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-brand-muted">No students match your search.</p>
            ) : (
              <ul className="divide-y divide-brand-border">
                {visible.map((s, i) => (
                  <li key={s.id} className="px-5 py-3 flex items-center gap-4">
                    <span className="w-8 text-xs text-brand-muted tabular-nums">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-text truncate">{s.fullName}</p>
                      <p className="text-xs text-brand-muted">{s.mobile}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setMark(s.id, true)}
                        aria-pressed={marks[s.id] === true}
                        className={`${toggleBase} ${marks[s.id] === true ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-brand-border text-brand-muted hover:border-green-600 hover:text-green-700'}`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setMark(s.id, false)}
                        aria-pressed={marks[s.id] === false}
                        className={`${toggleBase} ${marks[s.id] === false ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-brand-border text-brand-muted hover:border-brand-red hover:text-brand-red'}`}
                      >
                        Absent
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="px-5 py-3.5 border-t border-brand-border flex items-center justify-between gap-3">
              <p className="text-xs text-brand-muted">{dirty.length ? `${dirty.length} unsaved ${dirty.length === 1 ? 'change' : 'changes'}` : 'No unsaved changes'}</p>
              <button type="button" onClick={handleSave} disabled={saving || dirty.length === 0} className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-brand-navy hover:brightness-110 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
