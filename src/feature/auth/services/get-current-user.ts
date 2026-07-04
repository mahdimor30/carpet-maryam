import { eq } from "drizzle-orm";


import { usersTable } from "@/db/schema/users";

import { verifyAccessToken } from "../utils/verify-token";
import { db } from "#/db";

type Payload = {
  userId: number;
};

export async function getCurrentUser(
  token?: string
) {
  if (!token) {
    return null;
  }

  try {
    const payload =
      verifyAccessToken(token) as Payload;

    const user =
      await db.query.usersTable.findFirst({
        where: eq(
          usersTable.id,
          payload.userId
        ),
      });

    return user ?? null;
  } catch {
    return null;
  }
}