import { ProductsTable } from '@/feature/products/components/products-table'
import { getProducts } from '@/feature/products/serverFun/get-products'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'

export const Route = createFileRoute('/_authed/dashboard/products/')({
  component: DashboardProductsPage,
  async loader() {
    const products = await getProducts()
    return { products }
  },
  head: () => ({
    meta: [
      { title: 'مدیریت محصولات | فرش مریم' },
    ],
  }),
})

function DashboardProductsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            محصولات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            مدیریت محصولات و تنوع‌های فرش
          </p>
        </div>
        <Link
          to="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PlusCircleIcon className="h-4 w-4" />
          افزودن محصول
        </Link>
      </div>

      <ProductsTable />
    </div>
  )
}
