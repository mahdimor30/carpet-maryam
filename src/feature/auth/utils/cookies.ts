import { serialize } from 'cookie'

export function createAccessCookie(token: string) {
  return serialize('access_token', token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === 'production',

    sameSite: 'lax',

    path: '/',

    maxAge: 60 * 15,
  })
}

export function createRefreshCookie(token: string) {
  return serialize('refresh_token', token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === 'production',

    sameSite: 'lax',

    path: '/',

    maxAge: 60 * 60 * 24 * 30,
  })
}
