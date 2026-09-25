// @/server/auth/password.ts

const ITERATIONS = 600_000
const KEY_LENGTH = 256
const SALT_LENGTH = 16

const encoder = new TextEncoder()

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<ArrayBuffer> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LENGTH,
  )
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

  const hash = await deriveKey(password, salt)

  return [
    'pbkdf2-sha256',
    ITERATIONS,
    bytesToBase64(salt),
    bytesToBase64(new Uint8Array(hash)),
  ].join('$')
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [algorithm, iterations, saltBase64, hashBase64] =
    storedHash.split('$')

  if (
    algorithm !== 'pbkdf2-sha256' ||
    Number(iterations) !== ITERATIONS ||
    !saltBase64 ||
    !hashBase64
  ) {
    return false
  }

  const salt = base64ToBytes(saltBase64)

  const expectedHash = base64ToBytes(hashBase64)

  const actualHash = new Uint8Array(
    await deriveKey(password, salt),
  )

  if (actualHash.length !== expectedHash.length) {
    return false
  }

  // Constant-time comparison
  let result = 0

  for (let i = 0; i < actualHash.length; i++) {
    result |= actualHash[i] ^ expectedHash[i]
  }

  return result === 0
}