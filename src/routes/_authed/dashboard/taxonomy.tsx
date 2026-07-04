import TaxonomyManager from '@/feature/dashboard/pages/taxonomy-manager'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard/taxonomy')({
  component: DashboardTaxonomyPage,
  head: () => ({
    meta: [
      { title: 'مدیریت دسته‌بندی | فرش مریم' },
    ],
  }),
})

function DashboardTaxonomyPage() {
  return <TaxonomyManager />
}
