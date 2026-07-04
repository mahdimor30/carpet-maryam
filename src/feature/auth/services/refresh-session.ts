import { and, eq, gt } from "drizzle-orm";


import { refreshTokensTable } from "@/db/schema/refresh-tokens";

import { usersTable } from "@/db/schema/users";

import { signAccessToken } from "../utils/jwt";
import { db } from "#/db";

export async function refreshSession(
  refreshToken: string
) {
  const session =
    await db.query.refreshTokensTable.findFirst(
      {
        where: and(
          eq(
            refreshTokensTable.token,
            refreshToken
          ),

          gt(
            refreshTokensTable.expiresAt,
            new Date()
          )
        ),
      }
    );

  if (!session) {
    throw new Error("Invalid session");
  }

  const user =
    await db.query.usersTable.findFirst({
      where: eq(
        usersTable.id,
        session.userId
      ),
    });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken,
  };
}