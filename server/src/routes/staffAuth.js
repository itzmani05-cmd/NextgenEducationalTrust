import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import { requireStaff, signStaffToken } from '../auth.js'
import { PASSWORD_MIN_LENGTH } from '../staffConstants.js'

const router = Router()

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10)

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
})

router.post('/login', loginLimiter, async (req, res) => {
  const staffCode = String(req.body.staffCode || '').trim().toUpperCase()
  const password = String(req.body.password || '')
  const invalid = () => res.status(400).json({ error: 'Incorrect Staff ID or password.' })

  try {
    const staff = staffCode ? await prisma.staff.findUnique({ where: { staffCode } }) : null
    const ok = await bcrypt.compare(password, staff?.passwordHash || DUMMY_HASH)
    if (!staff || !ok) return invalid()
    if (!staff.active) return res.status(403).json({ error: 'This staff account has been deactivated. Please contact the Trust.' })

    await prisma.staff.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } })
    res.json({ token: signStaffToken(staff), mustChangePassword: staff.mustChangePassword, name: staff.name })
  } catch (err) {
    console.error('Staff login failed:', err)
    res.status(500).json({ error: 'Login failed.' })
  }
})

router.post('/change-password', requireStaff({ allowPasswordChange: true }), async (req, res) => {
  const currentPassword = String(req.body.currentPassword || '')
  const newPassword = String(req.body.newPassword || '')

  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `New password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  }
  if (newPassword === currentPassword) {
    return res.status(400).json({ error: 'Choose a password different from the current one.' })
  }

  try {
    if (!(await bcrypt.compare(currentPassword, req.staff.passwordHash))) {
      return res.status(400).json({ error: 'Current password is incorrect.' })
    }
    const staff = await prisma.staff.update({
      where: { id: req.staff.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 10), mustChangePassword: false, sessionVersion: { increment: 1 } },
    })
    res.json({ token: signStaffToken(staff) })
  } catch (err) {
    console.error('Staff password change failed:', err)
    res.status(500).json({ error: 'Failed to change password.' })
  }
})

export default router
