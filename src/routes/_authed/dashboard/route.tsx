import { DashboardShell } from '@/feature/dashboard/components/layout/dashboard-shell'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.user.role === 'customer') {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'داشبورد | فرش مریم' },
    ],
  }),
})

function RouteComponent() {
  return(
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}
