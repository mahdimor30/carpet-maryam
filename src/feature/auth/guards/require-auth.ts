import { getCurrentUser } from "../services/get-current-user";

export async function requireAuth(
  token?: string
) {
  const user = await getCurrentUser(token);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}