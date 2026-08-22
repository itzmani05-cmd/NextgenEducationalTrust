import { LogOut, Mail, User } from 'lucide-react'

export default function ProfileHeaderCard({ user, onSignOut }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="h-20 bg-gradient-to-r from-brand-navy to-[#1d4ba8]" />
      <div className="px-6 sm:px-8 pb-6">
        <div className="flex items-end justify-between -mt-9 mb-3">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand-surface ring-4 ring-white shadow-sm flex items-center justify-center text-brand-navy shrink-0">
              <User className="w-8 h-8" />
            </div>
          )}
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-red bg-brand-surface hover:bg-red-50 px-3 py-2 rounded-lg transition-colors mb-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
        <h1 className="text-xl font-bold text-brand-text truncate">
          {user.user_metadata?.full_name || 'Student'}
        </h1>
        <p className="text-sm text-brand-muted flex items-center gap-1.5 truncate mt-0.5">
          <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
        </p>
      </div>
    </div>
  )
}
