import { createServerFn } from '@tanstack/react-start'

import { refreshSession } from '../services/refresh-session'

import { createAccessCookie } from '../utils/cookies'

import { getRefreshToken } from '../utils/get-refresh-token'
import { getRequest } from '@tanstack/react-start/server'

export const refreshSessionAction = createServerFn({
  method: 'POST',
}).handler(async ({}) => {
  const request = getRequest()
  const cookie = request.headers.get('cookie')

  const refreshToken = getRefreshToken(cookie || undefined)

  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const result = await refreshSession(refreshToken)

  return new Response(null, {
    headers: {
      'Set-Cookie': createAccessCookie(result.accessToken),
    },
  })
})
