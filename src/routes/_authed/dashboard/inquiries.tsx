import { InquiriesPage } from '@/feature/dashboard/pages/inquiries-page'
import { getDashboardData } from '@/feature/dashboard/serverFn/get-dashboard-data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard/inquiries')({
  loader: async () => getDashboardData(),
  component: () => (
    <InquiriesPage inquiries={Route.useLoaderData().inquiries} />
  ),
  head: () => ({ meta: [{ title: 'استعلام‌ها | فرش مریم' }] }),
})
