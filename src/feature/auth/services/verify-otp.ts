import { eq, and, gt } from 'drizzle-orm'

import { usersTable } from '@/db/schema/users'

import { otpCodesTable } from '@/db/schema/otp-codes'

import { signAccessToken } from '../utils/jwt'
import type z from 'zod'
import { verifyOtpSchema } from '../validation/auth.validation'
import { db } from '#/db'
import { generateRefreshToken } from '../utils/refresh-token'
import { refreshTokensTable } from '#/db/schema/refresh-tokens'

type Input = z.infer<typeof verifyOtpSchema>

export async function verifyOtp(input: Input) {
  const validated = verifyOtpSchema.parse(input)

  const otp = await db.query.otpCodesTable.findFirst({
    where: and(
      eq(otpCodesTable.phone, validated.phone),

      eq(otpCodesTable.code, validated.code),

      gt(otpCodesTable.expiresAt, new Date()),
    ),
  })

  if (!otp) {
    throw new Error('Invalid OTP')
  }

  let user = await db.query.usersTable.findFirst({
    where: eq(usersTable.phone, validated.phone),
  })

  if (!user) {
    const [newUser] = await db
      .insert(usersTable)
      .values({
        phone: validated.phone,
      })
      .returning()

    user = newUser
  }

  console.log(user, 'user')

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  })
  const refreshToken = generateRefreshToken()

  const refreshExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

  await db.insert(refreshTokensTable).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: refreshExpiresAt,
  })

  return {
    user,

    accessToken,

    refreshToken,
  }
}
