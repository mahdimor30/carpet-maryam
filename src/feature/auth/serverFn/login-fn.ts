import { users } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { generateOtp } from '../utils/generate-otp'
import { getDb } from '@/server/db'

const OTP_EXPIRY_MINUTES = 2
const OTP_RESEND_COOLDOWN_SECONDS = 60 // فاصله‌ی حداقلی بین دو درخواست کد
const IRAN_MOBILE_REGEX = /^09\d{9}$/

export const loginFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      // اعتبارسنجی دقیق‌تر از صرفاً طول رشته
      phone: z.string().regex(IRAN_MOBILE_REGEX, 'شماره موبایل معتبر نیست'),
    }),
  )
  .handler(async ({ data }) => {
    const db = getDb()

    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.phone, data.phone),
      })

      // جلوگیری از اسپم: اگر کد قبلی هنوز خیلی تازه است، اجازه‌ی ارسال مجدد فوری نده
      if (user?.otpExpiresAt) {
        const otpAge =
          OTP_EXPIRY_MINUTES * 60 * 1000 -
          (new Date(user.otpExpiresAt).getTime() - Date.now())
        const secondsSinceLastSend = otpAge / 1000

        if (secondsSinceLastSend < OTP_RESEND_COOLDOWN_SECONDS) {
          const waitSeconds = Math.ceil(
            OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend,
          )
          return {
            success: false,
            message: `لطفاً ${waitSeconds} ثانیه دیگر دوباره تلاش کنید`,
          }
        }
      }

      const otpCode = generateOtp()
      const otpExpiresAt = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
      )

      if (!user) {
        // کاربر جدید با همین شماره ساخته می‌شود
        await db.insert(users).values({
          phone: data.phone,
          otpCode,
          otpExpiresAt,
          otpAttempts: 0,
        })
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

      // TODO: اتصال به سرویس SMS واقعی
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[OTP] کد ${otpCode} برای شماره ${data.phone} ارسال شد`)
      }
      // در پروداکشن ارسال از طریق سرویس پیامک واقعی انجام می‌شود؛ اینجا فقط placeholder است

      return {
        success: true,
        message: 'کد تایید ارسال شد',
        // فقط در محیط توسعه کد را برمی‌گردانیم؛ در پروداکشن هرگز نباید در پاسخ باشد
        ...(process.env.NODE_ENV !== 'production' ? { otpCode } : {}),
      }
    } catch (error) {
      console.error('[loginFn] خطا در ارسال کد تایید:', error)
      return {
        success: false,
        message: 'خطایی رخ داد؛ لطفاً دوباره تلاش کنید',
      }
    }
  })