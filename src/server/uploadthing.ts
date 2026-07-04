import { getDb } from '@/server/db'
import { sessions, variantImages } from '@/server/db/schema'
import {
  createUploadthing,
  UploadThingError,
  type FileRouter,
} from 'uploadthing/server'
import { jwtVerify } from 'jose'
import { eq } from 'drizzle-orm'
import z from 'zod'

const f = createUploadthing()

function getJwtSecret() {
  const secret = process.env.SESSION_JWT_SECRET
  if (!secret) throw new UploadThingError('SESSION_JWT_SECRET تنظیم نشده است')
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

async function resolveUserFromRequest(req: Request) {
  const db = getDb()
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) return null

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const parts = c.trim().split('=')
      return [
        decodeURIComponent(parts[0]),
        decodeURIComponent(parts.slice(1).join('=')),
      ]
    }),
  )
  const token = cookies['session_token']
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

export const uploadRouter = {
  // ─────────────────────────────────────────────────
  // آپلود موقت عکس محصول (بدون نیاز به variantId)
  // عکس در دیتابیس ذخیره نمی‌شود؛ URL برگردانده می‌شود
  // تا هنگام ثبت فرم محصول در دیتابیس ذخیره شود
  // ─────────────────────────────────────────────────
  temporaryImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 8,
    },
  })
    .middleware(async ({ req }) => {
      const user = await resolveUserFromRequest(req)
      if (!user) throw new UploadThingError('لطفاً ابتدا وارد حساب خود شوید')
      if (user.role === 'customer')
        throw new UploadThingError('فقط مدیر و کارمند مجاز به آپلود عکس هستند')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  // ─────────────────────────────────────────────────
  // آپلود عکس variant فرش
  // حداکثر ۸ عکس، هر کدام تا ۴ مگابایت
  // فقط admin و staff مجاز هستند
  // ─────────────────────────────────────────────────
  variantImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 8,
    },
  })
    .input(z.object({ variantId: z.number() }))
    .middleware(async ({ req, input }) => {
      const user = await resolveUserFromRequest(req)
      if (!user) throw new UploadThingError('لطفاً ابتدا وارد حساب خود شوید')
      if (user.role === 'customer')
        throw new UploadThingError('فقط مدیر و کارمند مجاز به آپلود عکس هستند')

      const { variantId } = input
      if (!variantId) throw new UploadThingError('variantId الزامی است')

      return { userId: user.id, variantId: Number(variantId) }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const db = getDb()

      const existing = await db.query.variantImages.findMany({
        where: (vi, { eq }) => eq(vi.variantId, metadata.variantId),
        columns: { sortOrder: true },
      })
      const nextOrder =
        existing.length > 0
          ? Math.max(...existing.map((e) => e.sortOrder)) + 1
          : 0

      const [inserted] = await db
        .insert(variantImages)
        .values({
          variantId: metadata.variantId,
          url: file.url,
          alt: file.name,
          sortOrder: nextOrder,
        })
        .returning()

      return { imageId: inserted.id, url: file.url, sortOrder: nextOrder }
    }),

  // ─────────────────────────────────────────────────
  // آپلود عکس پروفایل کاربر
  // فقط یک عکس، حداکثر ۲ مگابایت
  // هر کاربر لاگین‌شده‌ای مجاز است
  // ─────────────────────────────────────────────────
  profileImage: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await resolveUserFromRequest(req)
      if (!user) throw new UploadThingError('لطفاً ابتدا وارد حساب خود شوید')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
