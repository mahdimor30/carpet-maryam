import { getCurrentUserFn } from '@/feature/auth/serverFn/get-user-cuemt'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
    beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: '/dashboard' },
      })
    }

    // چک کامل بودن پروفایل
    const isProfileComplete = Boolean(user.name && user.email)

    if (!isProfileComplete && location.pathname !== '/complete-profile') {
      throw redirect({
        to: '/complete-profile',
        search: { redirect: location.pathname },
      })
    }

    return { user }
  },
})
