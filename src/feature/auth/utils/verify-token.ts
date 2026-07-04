import jwt from "jsonwebtoken";

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET!;

export function verifyAccessToken(
  token: string
) {
  return jwt.verify(token, ACCESS_SECRET);
}