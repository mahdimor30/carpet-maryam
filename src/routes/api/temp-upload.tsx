import { createFileRoute } from '@tanstack/react-router'
import { UTApi } from 'uploadthing/server'
import { getDb } from '@/server/db'
import { sessions } from '@/server/db/schema'
import { jwtVerify } from 'jose'
import { eq } from 'drizzle-orm'

function getJwtSecret() {
  const secret = process.env.SESSION_JWT_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

async function sha256Hex(value: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function resolveUser(req: Request) {
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const parts = c.trim().split('=')
      return [decodeURIComponent(parts[0]), decodeURIComponent(parts.slice(1).join('='))]
    }),
  )
  const token = cookies['session_token']
  if (!token) return null

  const secret = getJwtSecret()
  if (!secret) return null

  let payload: { sub?: string }
  try {
    const result = await jwtVerify(token, secret)
    payload = result.payload as { sub?: string }
  } catch {
    return null
  }
  if (!payload.sub) return null

  const db = getDb()
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
    where: (u, { eq }) => eq(u.id, Number(payload.sub)),
  })
  if (!user || !user.isActive) return null
  const { passwordHash, ...rest } = user
  return rest
}

const utapi = new UTApi()

export const Route = createFileRoute('/api/temp-upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await resolveUser(request)
          if (!user) {
            return new Response(JSON.stringify({ error: 'لطفاً ابتدا وارد حساب خود شوید' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }
          if (user.role === 'customer') {
            return new Response(JSON.stringify({ error: 'فقط مدیر و کارمند مجاز به آپلود هستند' }), {
              status: 403,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const formData = await request.formData()
          const file = formData.get('file')
          if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'فایلی ارسال نشده است' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const result = await utapi.uploadFiles(file)
          const data = Array.isArray(result) ? result[0] : result

          if (data.error) {
            return new Response(JSON.stringify({ error: data.error.message || 'خطا در آپلود' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          return new Response(JSON.stringify({ url: data.data.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err) {
          console.error(err)
          return new Response(JSON.stringify({ error: 'خطا در آپلود تصویر' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
