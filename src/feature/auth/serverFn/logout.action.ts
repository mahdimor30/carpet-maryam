import { createServerFn } from '@tanstack/react-start'

import { logout } from '../services/logout'

import { getRefreshToken } from '../utils/get-refresh-token'
import { getRequest } from '@tanstack/react-start/server'

function serialize(name: string, val: string, opts: { path: string; expires: Date }) {
  return `${name}=${val}; Path=${opts.path}; Expires=${opts.expires.toUTCString()}`
}

export const logoutAction = createServerFn({
  method: 'POST',
}).handler(async ({}) => {
  const request = getRequest()
  const cookie = request.headers.get('cookie')

  const refreshToken = getRefreshToken(cookie || undefined)

  if (refreshToken) {
    await logout(refreshToken)
  }

  return new Response(null, {
    headers: [
      ['Set-Cookie', serialize('access_token', '', { path: '/', expires: new Date(0) })],
      ['Set-Cookie', serialize('refresh_token', '', { path: '/', expires: new Date(0) })],
    ],
  })
})
