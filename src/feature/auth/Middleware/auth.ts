/**
 * middleware/auth.ts
 *
 * دو middleware:
 *   authMiddleware  — کاربر لاگین‌شده الزامی (هر role)
 *   staffMiddleware — فقط admin و staff
 *
 * استفاده در server fn:
 *   createServerFn().middleware([authMiddleware]).handler(async ({ context }) => {
 *     context.user  // type-safe، بدون null
 *   })
 *
 * استفاده در server route:
 *   server: { middleware: [authMiddleware], handlers: { GET: ... } }
 */
import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { jwtVerify } from 'jose'
import { eq } from 'drizzle-orm'
import { getDb } from '@/server/db'
import { sessions } from '@/server/db/schema'
import { getCookie } from '@tanstack/react-start/server'

const SESSION_COOKIE_NAME = 'session_token'

function getJwtSecret() {
  const secret = process.env.SESSION_JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

async function sha256Hex(value: string) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  )
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── هسته مشترک — همان منطق getCurrentUserFn ─────────────────────────────
async function resolveUser() {
  const db = getDb()
  const token = getCookie(SESSION_COOKIE_NAME)
  
  if (!token) return null

  let payload: { sub?: string }
  try {
    const result = await jwtVerify(token, getJwtSecret())
    payload = result.payload as { sub?: string }
  } catch {
    return null
  }

  if (!payload.sub) return null
  const userId = Number(payload.sub)

  const tokenHash = await sha256Hex(token)

  const session = await db.query.sessions.findFirst({
    where: (s, { eq }) => eq(s.token, tokenHash),
  })

  if (!session) return null

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, session.id))
    return null
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  })

  if (!user || !user.isActive) return null

  const { passwordHash, ...withoutPassword } = user
  return withoutPassword
}

// ─── ۱. authMiddleware ────────────────────────────────────────────────────
export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next }) => {
    const user = await resolveUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { user } })
  },
)

// ─── ۲. staffMiddleware (روی authMiddleware بنا شده) ─────────────────────
export const staffMiddleware = createMiddleware({ type: 'function' })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.user.role === 'customer') {
      throw redirect({ to: '/' })
    }

    return next({ context: { user: context.user } })
  })