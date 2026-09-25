import { getDb } from '@/server/db'
import { sessions, users } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { getRequest, setCookie } from '@tanstack/react-start/server'
import { eq, sql } from 'drizzle-orm'
import { SignJWT } from 'jose'
import { z } from 'zod'
// در Bun، node:crypto (شامل timingSafeEqual) نیتیو و سریع پیاده‌سازی شده؛
// با ایمپورت صریح از node:crypto جلوی تداخل با global `crypto` (Web Crypto API)
// که برای subtle.digest و randomUUID استفاده می‌شه رو می‌گیریم.
import { timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto'

const MAX_OTP_ATTEMPTS = 5
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // ۳۰ روز
const SESSION_COOKIE_NAME = 'session_token'
const IRAN_MOBILE_REGEX = /^09\d{9}$/

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

// مقایسه با زمان ثابت تا از حمله‌ی timing جلوگیری شود
// (مقایسه‌ی معمولی `a === b` می‌تونه بر اساس زمان پاسخ، اطلاعات درباره‌ی
// تعداد کاراکترهای درست لو بده)
function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) {
    // طول‌های نابرابر رو هم با یک مقایسه‌ی بی‌اثر جبران می‌کنیم تا زمان اجرا تغییر نکنه
    nodeTimingSafeEqual(aBuf, aBuf)
    return false
  }
  return nodeTimingSafeEqual(aBuf, bBuf)
}

function getClientIp(): string | null {
  try {
    const request = getRequest()
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? null
  } catch {
    return null
  }
}

async function createSessionForUser(userId: number) {
  const db = getDb()
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)

  // JWT که در کوکی کاربر ذخیره می‌شود (حاوی userId و یک شناسه‌ی یکتای سشن)
  const sessionId = crypto.randomUUID()
  const token = await new SignJWT({ sub: String(userId), sid: sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getJwtSecret())

  // طبق اسکیما: توکن باید هش‌شده ذخیره شود، نه خام
  const tokenHash = await sha256Hex(token)

  await db.insert(sessions).values({
    userId,
    token: tokenHash,
    userAgent: null,
    ipAddress: getClientIp(),
    expiresAt,
  })

  setCookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export const verifyOtpFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      phone: z.string().regex(IRAN_MOBILE_REGEX, 'شماره موبایل معتبر نیست'),
      otpCode: z.string().length(6),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const db = getDb()
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.phone, data.phone),
      })

      if (!user) {
        return {
          success: false,
          message: 'کاربری با این شماره موبایل یافت نشد',
        }
      }

      if (!user.otpCode || !user.otpExpiresAt) {
        return {
          success: false,
          message: 'کد تاییدی برای این شماره ارسال نشده است',
        }
      }

      // اگر تعداد تلاش‌های اشتباه از حد مجاز گذشته باشد
      if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        return {
          success: false,
          message: 'تعداد تلاش‌های شما بیش از حد مجاز است. کد جدید درخواست کنید',
        }
      }

      // بررسی انقضای کد
      const isExpired = new Date(user.otpExpiresAt).getTime() < Date.now()
      if (isExpired) {
        return {
          success: false,
          message: 'کد تایید منقضی شده است. کد جدید درخواست کنید',
        }
      }

      // بررسی صحت کد (مقایسه‌ی با زمان ثابت)
      if (!timingSafeEqual(user.otpCode, data.otpCode)) {
        // افزایش اتمیک در سطح دیتابیس تا در درخواست‌های همزمان مقدار درستی ثبت شود
        await db
          .update(users)
          .set({ otpAttempts: sql`${users.otpAttempts} + 1` })
          .where(eq(users.id, user.id))

        return {
          success: false,
          message: 'کد تایید نادرست است',
        }
      }

      // کد درست است: پاک کردن OTP و ثبت تاریخ تایید شماره (اولین بار)
      await db
        .update(users)
        .set({
          otpCode: null,
          otpExpiresAt: null,
          otpAttempts: 0,
          phoneVerifiedAt: user.phoneVerifiedAt ?? new Date(),
        })
        .where(eq(users.id, user.id))

      // ساخت سشن جدید (JWT امضاشده) و ست‌کردن آن در کوکی
      await createSessionForUser(user.id)

      return {
        success: true,
        message: 'شماره موبایل با موفقیت تایید شد',
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
      }
    } catch (error) {
      console.error('[verifyOtpFn] خطا در تایید کد:', error)
      return {
        success: false,
        message: 'خطایی رخ داد؛ لطفاً دوباره تلاش کنید',
      }
    }
  })