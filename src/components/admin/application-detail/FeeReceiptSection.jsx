import { Receipt, ExternalLink, RefreshCw } from 'lucide-react'
import { enOnly } from '../../../i18n/bilingual.js'

export default function FeeReceiptSection({ app, receiptError, receiptBusy, onViewReceipt, onGenerateReceipt }) {
  const receiptNumber = app.payment?.receiptNumber

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 mb-6">
      <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-4 flex items-center gap-2">
        <Receipt className="w-4 h-4" /> Fee Receipt
      </h3>
      {receiptError && <p className="text-sm text-brand-red mb-3">{receiptError}</p>}
      {receiptNumber ? (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold text-brand-text">{receiptNumber}</p>
            <p className="text-xs text-brand-muted">Itemizes course fee, discount, and amount paid.</p>
          </div>
          <button
            type="button"
            onClick={onViewReceipt}
            disabled={receiptBusy}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
          >
            <ExternalLink className="w-4 h-4" /> {receiptBusy ? enOnly('admin.common.opening') : 'View Receipt'}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-brand-muted">
            Payment is approved but the fee receipt hasn&apos;t been generated yet.
          </p>
          <button
            type="button"
            onClick={onGenerateReceipt}
            disabled={receiptBusy}
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
          >
            <RefreshCw className="w-4 h-4" /> {receiptBusy ? 'Generating…' : 'Generate Receipt'}
          </button>
        </div>
      )}
    </div>
  )
}
