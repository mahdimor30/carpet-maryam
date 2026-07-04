import { parse } from "cookie";

export function getCookieToken(
  cookieHeader?: string
) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);

  return cookies.access_token ?? null;
}