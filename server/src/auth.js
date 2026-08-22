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

// Constant-time comparison so login isn't vulnerable to a timing attack.
export function passwordMatches(candidate) {
  const expected = process.env.ADMIN_PASSWORD || ''
  const a = Buffer.from(String(candidate || ''))
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

// The shared ADMIN_PASSWORD (checked above) remains the actual login
// credential — this just gives whoever logs in a stable DB-backed identity
// (id/email) so approvals and the audit trail can record *who* acted,
// instead of only "an admin." Auto-provisioned on first successful login;
// the stored passwordHash is a snapshot, never itself checked at login time.
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

// Allows either an admin token or the Supabase-authenticated owner of the
// resource through — used for endpoints (certificate download) both sides
// legitimately need to read. `getOwnerAuthUserId(req)` resolves the resource's
// owning authUserId; access is denied if it doesn't match the caller.
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
      // Not a valid admin token — fall through and try it as an applicant token.
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

// Verifies a Supabase Auth session (Google sign-in) and attaches the user to
// req.authUser. Used to gate starting a new scholarship application.
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
