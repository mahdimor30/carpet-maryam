import { parse } from "cookie";

export function getRefreshToken(
  cookieHeader?: string
) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);

  return cookies.refresh_token ?? null;
}