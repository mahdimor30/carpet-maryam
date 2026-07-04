import { getDb } from '@/server/db'
import { sessions } from '@/server/db/schema'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'session_token'

function getJwtSecret() {
  const secret = process.env.SESSION_JWT_SECRET
  if (!secret) {
    throw new Error('متغیر محیطی SESSION_JWT_SECRET تنظیم نشده است')
  }
  return new TextEncoder().encode(secret)
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Buffer.from(hashBuffer).toString('hex')
}

/**
 * کوکی سشن را می‌خواند، JWT را اعتبارسنجی می‌کند، و وجود/اعتبار آن را
 * در جدول sessions تایید می‌کند. در صورت نامعتبر بودن، null برمی‌گرداند.
 */
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb()
    const token = getCookie(SESSION_COOKIE_NAME)
    if (!token) return null

    // ۱. اعتبارسنجی امضای JWT و انقضای آن
    let payload: { sub?: string; sid?: string }
    try {
      const result = await jwtVerify(token, getJwtSecret())
      payload = result.payload as { sub?: string; sid?: string }
    } catch {
      // امضای نامعتبر، دستکاری‌شده، یا منقضی
      return null
    }

    if (!payload.sub) return null
    const userId = Number(payload.sub)

    // ۲. بررسی این‌که سشن هنوز در دیتابیس وجود دارد و revoke نشده است

    const tokenHash = await sha256Hex(token)

    const session = await db.query.sessions.findFirst({
      where: (sessions, { eq }) => eq(sessions.token, tokenHash),
    })

    if (!session) return null // سشن حذف/revoke شده

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      // سشن منقضی شده؛ از دیتابیس هم حذفش می‌کنیم
      await db.delete(sessions).where(eq(sessions.id, session.id))
      return null
    }

    // ۳. واکشی اطلاعات کاربر
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })

    if (!user || !user.isActive) return null

    const { passwordHash, ...withOuthPasssword } = user

    return {
      ...withOuthPasssword,
    }
  },
)

createMiddleware
