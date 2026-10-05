import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getSupabaseAdmin } from './supabaseAdmin.js'
import { prisma } from './prismaClient.js'

const TOKEN_TTL = '12h'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set.')
  return secret
}

export function passwordMatches(candidate) {
  const expected = process.env.ADMIN_PASSWORD || ''
  const a = Buffer.from(String(candidate || ''))
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export async function getOrCreateAdminIdentity() {
  const email = (process.env.ADMIN_EMAIL || 'admin@ngcollege.trust').trim().toLowerCase()
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) return existing

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || '', 10)
  return prisma.adminUser.create({ data: { email, passwordHash } })
}

export function signAdminToken(admin) {
  return jwt.sign({ role: 'admin', sub: admin.id, email: admin.email }, getSecret(), { expiresIn: TOKEN_TTL })
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token.' })
  }

  try {
    const payload = jwt.verify(token, getSecret())
    if (payload.role !== 'admin') throw new Error('Not an admin token.')
    req.admin = { id: payload.sub, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' })
  }
}

export function requireAdminOrOwner(getOwnerAuthUserId) {
  return async (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token.' })
    }

    try {
      const payload = jwt.verify(token, getSecret())
      if (payload.role === 'admin') {
        req.admin = { id: payload.sub, email: payload.email }
        return next()
      }
    } catch {
    }

    try {
      const { data, error } = await getSupabaseAdmin().auth.getUser(token)
      if (error || !data?.user) throw error || new Error('No user.')

      const ownerId = await getOwnerAuthUserId(req)
      if (!ownerId || ownerId !== data.user.id) {
        return res.status(403).json({ error: 'Not authorized to access this resource.' })
      }
      req.authUser = data.user
      next()
    } catch {
      res.status(401).json({ error: 'Your session has expired. Please sign in again.' })
    }
  }
}

export async function requireApplicantAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Please sign in with Google before applying.' })
  }

  try {
    const { data, error } = await getSupabaseAdmin().auth.getUser(token)
    if (error || !data?.user) throw error || new Error('No user.')
    req.authUser = data.user
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' })
  }
}


export function signStaffToken(staff) {
  return jwt.sign({ role: 'staff', sub: staff.id, code: staff.staffCode, v: staff.sessionVersion }, getSecret(), { expiresIn: TOKEN_TTL })
}

export function requireStaff({ allowPasswordChange = false } = {}) {
  return async (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Missing authorization token.' })

    let payload
    try {
      payload = jwt.verify(token, getSecret())
      if (payload.role !== 'staff') throw new Error('Not a staff token.')
    } catch {
      return res.status(401).json({ error: 'Invalid or expired session.' })
    }

    try {
      const staff = await prisma.staff.findUnique({ where: { id: payload.sub } })
      if (!staff || !staff.active) return res.status(401).json({ error: 'This staff account is not active.' })
      if (payload.v !== staff.sessionVersion) {
        return res.status(401).json({ error: 'Your password was changed. Please sign in again.' })
      }
      if (staff.mustChangePassword && !allowPasswordChange) {
        return res.status(403).json({ error: 'Please change your temporary password first.', code: 'PASSWORD_CHANGE_REQUIRED' })
      }
      req.staff = staff
      next()
    } catch (err) {
      next(err)
    }
  }
}
