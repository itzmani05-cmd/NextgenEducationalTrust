import { ChevronLeft, ChevronRight } from 'lucide-react'

function pageItems(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const items = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  if (start > 2) items.push('start-gap')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < pageCount - 1) items.push('end-gap')
  items.push(pageCount)
  return items
}

const navButton =
  'inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-sm font-medium text-brand-text border border-brand-border bg-white hover:border-brand-navy transition-colors disabled:opacity-40 disabled:hover:border-brand-border'

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50], itemLabel = 'entries' }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-brand-border bg-white text-sm">
      <div className="flex items-center gap-4 text-brand-muted">
        <span>
          Showing <span className="font-semibold text-brand-text">{from}–{to}</span> of{' '}
          <span className="font-semibold text-brand-text">{total}</span> {itemLabel}
        </span>
        {onPageSizeChange && (
          <label className="hidden sm:flex items-center gap-2">
            Rows
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-brand-border bg-white px-2 py-1 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {pageCount > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button type="button" className={navButton} onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pageItems(page, pageCount).map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? 'page' : undefined}
                className={item === page ? `${navButton} !bg-brand-navy !border-brand-navy !text-white` : navButton}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="px-1 text-brand-muted">…</span>
            ),
          )}
          <button type="button" className={navButton} onClick={() => onPageChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  )
}
