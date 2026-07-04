import LoginPage from '@/feature/auth/components/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: 'ورود | فرش مریم' },
      { name: 'description', content: 'ورود به حساب کاربری فروشگاه فرش مریم' },
    ],
  }),
})
