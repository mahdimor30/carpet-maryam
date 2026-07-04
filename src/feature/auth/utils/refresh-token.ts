import crypto from "crypto";

export function generateRefreshToken() {
  return crypto.randomUUID();
}