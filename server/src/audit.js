import { prisma } from './prismaClient.js'

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
