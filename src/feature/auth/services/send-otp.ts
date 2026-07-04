
import { generateOtp } from '../utils/generate-otp'
import { sendOtpSchema } from '../validation/auth.validation'
import type z from 'zod'

type Input = z.infer<typeof sendOtpSchema>

export async function sendOtp(input: Input) {
  sendOtpSchema.parse(input)

  const code = generateOtp()

  // await db.insert(otpCodesTable).values({
  //   phone: validated.phone,
  //   code,
  //   expiresAt,
  // })

  // TODO:
  // send sms provider

  console.log('OTP:', code)

  return {
    success: true,
  }
}
