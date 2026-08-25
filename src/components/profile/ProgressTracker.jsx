import { Fragment } from 'react'
import {
  CheckCircle2, Circle, Clock, FileText, Percent, ShieldCheck, Wallet, XCircle,
} from 'lucide-react'

const STEP_ICONS = {
  done: CheckCircle2,
  active: Clock,
  rejected: XCircle,
  pending: Circle,
}

const STEP_STYLES = {
  done: { ring: 'bg-brand-navy text-white', line: 'bg-brand-navy', text: 'text-brand-text' },
  active: { ring: 'bg-white border-2 border-brand-amber text-brand-amber', line: 'bg-brand-border', text: 'text-brand-text' },
  rejected: { ring: 'bg-white border-2 border-brand-red text-brand-red', line: 'bg-brand-border', text: 'text-brand-text' },
  pending: { ring: 'bg-brand-surface text-brand-muted', line: 'bg-brand-border', text: 'text-brand-muted' },
}

export default function ProgressTracker({ application }) {
  const verificationDone = !['submitted', 'under_review'].includes(application.status)
  const concessionApproved = application.finalApprovedConcession != null
  const payment = application.payment

  let paymentState = 'pending'
  let paymentSubtitle = 'Not started'
  if (payment?.status === 'approved') {
    paymentState = 'done'
    paymentSubtitle = 'Payment Verified'
  } else if (payment?.status === 'rejected') {
    paymentState = 'rejected'
    paymentSubtitle = 'Rejected — resubmission needed'
  } else if (payment?.status === 'submitted') {
    paymentState = 'active'
    paymentSubtitle = 'Under Verification'
  } else if (concessionApproved) {
    paymentState = 'active'
    paymentSubtitle = 'Ready to pay'
  }

  const steps = [
    { state: 'done', icon: FileText, title: 'Application', subtitle: 'Submitted' },
    {
      state: verificationDone ? 'done' : 'active',
      icon: ShieldCheck,
      title: 'Verification',
      subtitle: verificationDone ? 'Verified' : 'In progress',
    },
    {
      state: concessionApproved ? 'done' : 'pending',
      icon: Percent,
      title: 'Concession',
      subtitle: concessionApproved ? `Approved — ${application.finalApprovedConcession}%` : 'Pending',
    },
    { state: paymentState, icon: Wallet, title: 'Payment', subtitle: paymentSubtitle },
  ]

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted mb-5 sm:mb-6">
        Application Progress
      </p>

      {/* Stacked vertical timeline on narrow screens — a 4-up horizontal strip
          doesn't fit without forcing an easy-to-miss horizontal scroll. */}
      <div className="sm:hidden">
        {steps.map((step, i) => {
          const Icon = step.icon
          const StepIcon = STEP_ICONS[step.state]
          const style = STEP_STYLES[step.state]
          const isLast = i === steps.length - 1
          return (
            <div key={step.title} className={`flex gap-3 ${isLast ? '' : 'pb-5'}`}>
              <div className="flex flex-col items-center">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${style.ring}`}>
                  <Icon className="w-4.5 h-4.5" />
                  {step.state !== 'pending' && (
                    <StepIcon
                      className={`w-3.5 h-3.5 absolute -bottom-1 -right-1 rounded-full bg-white ${
                        step.state === 'done' ? 'text-brand-navy' : step.state === 'rejected' ? 'text-brand-red' : 'text-brand-amber'
                      }`}
                    />
                  )}
                </div>
                {!isLast && <div className={`w-0.5 flex-1 mt-1 rounded-full ${style.line}`} />}
              </div>
              <div className="pt-1.5 min-w-0">
                <p className={`text-sm font-semibold ${style.text}`}>{step.title}</p>
                <p className="text-xs text-brand-muted mt-0.5 leading-snug">{step.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Horizontal strip from sm upward, where 4 steps comfortably fit. */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="flex items-start min-w-max sm:min-w-0">
          {steps.map((step, i) => {
            const Icon = step.icon
            const StepIcon = STEP_ICONS[step.state]
            const style = STEP_STYLES[step.state]
            return (
              <Fragment key={step.title}>
                <div className="flex flex-col items-center text-center w-28 shrink-0">
                  <div className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${style.ring}`}>
                    <Icon className="w-5 h-5" />
                    {step.state !== 'pending' && (
                      <StepIcon
                        className={`w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-white ${
                          step.state === 'done' ? 'text-brand-navy' : step.state === 'rejected' ? 'text-brand-red' : 'text-brand-amber'
                        }`}
                      />
                    )}
                  </div>
                  <p className={`text-xs font-semibold mt-2.5 ${style.text}`}>{step.title}</p>
                  <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{step.subtitle}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mt-[22px] rounded-full ${style.line}`} />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
