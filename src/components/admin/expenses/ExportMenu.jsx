import { useEffect, useRef, useState } from 'react'
import { Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react'

const OPTIONS = [
  { format: 'csv', label: 'Export as CSV', icon: FileSpreadsheet },
  { format: 'pdf', label: 'Export as PDF', icon: FileText },
]

export default function ExportMenu({ disabled, onExport }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = async (format) => {
    setOpen(false)
    setBusy(true)
    try {
      await onExport(format)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled || busy}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 bg-white border border-brand-border text-brand-text px-4 py-2.5 rounded-lg text-sm font-semibold hover:border-brand-navy transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" /> {busy ? 'Exporting…' : 'Export'}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-lg shadow-lg py-1 z-20">
          {OPTIONS.map(({ format, label, icon: Icon }) => (
            <button
              key={format}
              type="button"
              role="menuitem"
              onClick={() => choose(format)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-brand-text hover:bg-brand-surface transition-colors"
            >
              <Icon className="w-4 h-4 text-brand-muted" /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
