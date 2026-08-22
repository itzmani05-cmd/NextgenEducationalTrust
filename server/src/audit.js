import { prisma } from './prismaClient.js'

// Institutional audit trail for consequential admin actions (document review,
// concession approval, application rejection, payment approve/reject,
// certificate issuance). A logging failure never blocks the action itself —
// it's swallowed and reported to the console instead.
export async function logAudit({
  adminEmail, applicationId, paymentId, action, oldStatus, newStatus, oldValue, newValue, remarks,
}) {
  try {
    await prisma.auditLog.create({
      data: {
        adminEmail: adminEmail || null,
        applicationId: applicationId || null,
        paymentId: paymentId || null,
        action,
        oldStatus: oldStatus || null,
        newStatus: newStatus || null,
        oldValue: oldValue ?? undefined,
        newValue: newValue ?? undefined,
        remarks: remarks || null,
      },
    })
  } catch (err) {
    console.error('Failed to write audit log:', err)
  }
}
