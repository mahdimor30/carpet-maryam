import { OrdersPage } from '@/feature/dashboard/pages/orders-page'
import { getDashboardData } from '@/feature/dashboard/serverFn/get-dashboard-data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard/orders')({
  loader: async () => getDashboardData(),
  component: () => <OrdersPage orders={Route.useLoaderData().orders} />,
  head: () => ({ meta: [{ title: 'سفارش‌ها | فرش مریم' }] }),
})
