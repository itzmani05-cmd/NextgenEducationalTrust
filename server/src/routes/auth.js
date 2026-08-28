import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { passwordMatches, signAdminToken, getOrCreateAdminIdentity } from '../auth.js'

const router = Router()

// ADMIN_PASSWORD is a single shared secret with no lockout of its own —
// this is what actually stops it being brute-forced. Successful logins
// don't count against the limit, only wrong-password attempts do.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
})

router.post('/login', loginLimiter, async (req, res) => {
  const { password } = req.body

  if (!passwordMatches(password)) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  try {
    const admin = await getOrCreateAdminIdentity()
    res.json({ token: signAdminToken(admin) })
  } catch (err) {
    console.error('Failed to establish admin identity:', err)
    res.status(500).json({ error: 'Login failed.' })
  }
})

export default router
