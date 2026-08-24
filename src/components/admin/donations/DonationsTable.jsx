import { enOnly } from '../../../i18n/bilingual.js'
import DonationRow from './DonationRow.jsx'

export default function DonationsTable({ donations, loading, onVerify, onReject, onViewReceipt, onRetryEmail }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs text-brand-muted uppercase tracking-wide">
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colDonor')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colContact')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colAmount')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colPurpose')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colPan')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colTransactionRef')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colDate')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colStatus')}</th>
              <th className="px-5 py-3 font-semibold">{enOnly('admin.donations.colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && donations.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-brand-muted">
                  {enOnly('admin.donations.noDonationsFound')}
                </td>
              </tr>
            )}
            {donations.map((donation) => (
              <DonationRow
                key={donation.id}
                donation={donation}
                onVerify={onVerify}
                onReject={onReject}
                onViewReceipt={onViewReceipt}
                onRetryEmail={onRetryEmail}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
