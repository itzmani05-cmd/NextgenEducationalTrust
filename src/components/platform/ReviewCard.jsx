import { Star, ThumbsUp, BadgeCheck } from 'lucide-react'

export default function ReviewCard({ name, rating, time, review, likes, badge }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-6 sm:p-8 flex flex-col w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-brand-rust text-white flex items-center justify-center font-semibold shrink-0">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-brand-ink truncate">{name}</p>
            {badge && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-brand-rust bg-brand-rust/10 rounded-full px-1.5 py-0.5 shrink-0">
                <BadgeCheck className="w-3 h-3" />
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-brand-rust fill-brand-rust" />
        ))}
      </div>
      <p className="text-sm text-brand-muted leading-relaxed flex-1">{review}</p>
      {likes ? (
        <div className="flex items-center gap-1.5 text-xs text-brand-muted mt-4 pt-4 border-t border-brand-border">
          <ThumbsUp className="w-3.5 h-3.5" />
          {likes} {likes === 1 ? 'like' : 'likes'}
        </div>
      ) : null}
    </div>
  )
}
