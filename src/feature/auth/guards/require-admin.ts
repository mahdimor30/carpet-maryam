import { requireAuth } from "./require-auth";

export async function requireAdmin(
  token?: string
) {
  const user = await requireAuth(token);

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}