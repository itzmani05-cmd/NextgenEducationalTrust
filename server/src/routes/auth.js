import { Router } from 'express'
import { passwordMatches, signAdminToken, getOrCreateAdminIdentity } from '../auth.js'

const router = Router()

router.post('/login', async (req, res) => {
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
