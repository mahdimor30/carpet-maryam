import RegisterPage from '@/feature/auth/pages/complete-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/complete-profile')({
  loader: async ({context}) => {
    return { 
      user: context.user
    }
  },
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: 'تکمیل پروفایل | فرش مریم' },
    ],
  }),
})

