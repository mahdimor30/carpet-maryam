// @/feature/auth/serverFn/complete-profile.ts

import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { users } from '@/server/db/schema'
import { getDb } from '@/server/db'

import { getCurrentUserFn } from './get-user-cuemt'
import { hashPassword } from '../utils/password'

const completeProfileSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100),

  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),

  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
})

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>

export const completeProfileFn = createServerFn({
  method: 'POST',
})
  .validator((data: CompleteProfileInput) => completeProfileSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      // 1. بررسی لاگین بودن کاربر
      const user = await getCurrentUserFn()

      if (!user) {
        return {
          success: false,
          error: 'لطفاً ابتدا وارد شوید',
        } as const
      }

      const db = getDb()

      // 2. نرمال‌سازی ایمیل
      const normalizedEmail = data.email?.trim()
        ? data.email.trim().toLowerCase()
        : null

      // 3. بررسی تکراری نبودن ایمیل
      if (normalizedEmail) {
        const existingEmail = await db.query.users.findFirst({
          where: (users, { eq, and, ne }) =>
            and(eq(users.email, normalizedEmail), ne(users.id, user.id)),
        })

        if (existingEmail) {
          return {
            success: false,
            error: 'این ایمیل قبلاً ثبت شده است',
          } as const
        }
      }

      // 4. Hash کردن password با Web Crypto API
      // بدون Bun و بدون Node-specific API
      const passwordHash = await hashPassword(data.password)

      // 5. آپدیت پروفایل
      await db
        .update(users)
        .set({
          name: data.name.trim(),
          email: normalizedEmail,
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))

      return {
        success: true,
      } as const
    } catch (error) {
      console.error('[completeProfileFn] خطا در تکمیل پروفایل:', error)

      return {
        success: false,
        error: 'خطایی رخ داد؛ لطفاً دوباره تلاش کنید',
      } as const
    }
  })
