import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-brand-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left font-medium text-brand-text"
      >
        {q}
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-brand-muted transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <p className="pb-4 text-sm text-brand-muted">{a}</p>}
    </div>
  )
}
