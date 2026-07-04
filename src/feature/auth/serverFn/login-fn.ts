import { users } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { generateOtp } from '../utils/generate-otp'
import { getDb } from '@/server/db'

const OTP_EXPIRY_MINUTES = 2



export const loginFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      phone: z.string().min(11).max(11),
    }),
  )
  .handler(async ({ data }) => {
    const db = getDb()

    let user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.phone, data.phone),
    })

    const otpCode = generateOtp()
    const otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
    ).toISOString()

    if (!user) {
      // کاربر جدید با همین شماره ساخته می‌شود
      const [created] = await db
        .insert(users)
        .values({
          phone: data.phone,
          otpCode,
          otpExpiresAt,
          otpAttempts: 0,
        })
        .returning()

      user = created
    } else {
      // کاربر موجود است؛ فقط کد جدید برایش ست می‌شود
      await db
        .update(users)
        .set({
          otpCode,
          otpExpiresAt,
          otpAttempts: 0,
        })
        .where(eq(users.id, user.id))
    }

    // TODO: اتصال به سرویس SMS واقعی - فعلاً فقط لاگ می‌شود
    console.log(`[OTP] کد ${otpCode} برای شماره ${data.phone} ارسال شد`)

    return {
      success: true,
      message: 'کد تایید ارسال شد',
      // فقط برای محیط توسعه؛ قبل از پروداکشن حذف شود
      otpCode,
    }
  })