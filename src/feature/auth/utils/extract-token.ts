export function extractToken(
  authHeader?: string
) {
  if (!authHeader) {
    return null;
  }

  const [type, token] =
    authHeader.split(" ");

  if (type !== "Bearer") {
    return null;
  }

  return token;
}