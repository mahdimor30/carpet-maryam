import { UsersPage } from '@/feature/dashboard/pages/users-page'
import { getDashboardData } from '@/feature/dashboard/serverFn/get-dashboard-data'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_authed/dashboard/users')({ loader: async () => getDashboardData(), component: () => <UsersPage users={Route.useLoaderData().users} />, head: () => ({ meta: [{ title: 'کاربران | فرش مریم' }] }) })
