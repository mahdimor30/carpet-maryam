import { DashboardShell } from '@/feature/dashboard/components/layout/dashboard-shell'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
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
