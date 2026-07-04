import { eq } from 'drizzle-orm'

import { refreshTokensTable } from '@/db/schema/refresh-tokens'
import { db } from '#/db'

export async function logout(refreshToken: string) {
  await db
    .delete(refreshTokensTable)
    .where(eq(refreshTokensTable.token, refreshToken))

  return {
    success: true,
  }
}
