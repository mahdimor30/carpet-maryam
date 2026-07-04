// @/feature/auth/serverFn/complete-profile.ts

import { users } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getCurrentUserFn } from './get-user-cuemt'
import { getDb } from '@/server/db'

const completeProfileSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
})

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>

export const completeProfileFn = createServerFn({ method: 'POST' })
  .validator((data: CompleteProfileInput) => completeProfileSchema.parse(data))
  .handler(async ({ data }) => {
    // ۱. بررسی لاگین بودن کاربر
    const user = await getCurrentUserFn()
    if (!user) {
      return { success: false, error: 'لطفاً ابتدا وارد شوید' } as const
    }

    const db = getDb()

    // ۲. بررسی تکراری نبودن ایمیل (اگر ارسال شده)
    if (data.email) {
      const existingEmail = await db.query.users.findFirst({
        where: (users, { eq, and, ne }) =>
          and(eq(users.email, data.email!), ne(users.id, user.id)),
      })

      if (existingEmail) {
        return { success: false, error: 'این ایمیل قبلاً ثبت شده است' } as const
      }
    }

    // ۳. آپدیت پروفایل
    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, user.id))

    return { success: true } as const
  })