import { createFileRoute, Link } from '@tanstack/react-router'
import { getProducts } from '@/feature/products/serverFun/get-products'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: DashboardPage,
  async loader() {
    const products = await getProducts()
    return { products }
  },
  head: () => ({
    meta: [
      { title: 'نمای کلی | فرش مریم' },
    ],
  }),
})

import { Package, Layers, ShoppingCart, MessageSquare, PlusCircle, ArrowLeft } from 'lucide-react'
import { ProductsTable } from '@/feature/products/components/products-table'
import { toFa } from '@/lib/dashboard-data'

const STATS = [
  { label: 'کل محصولات', value: 312, icon: Package, accent: 'text-chart-2 bg-chart-2/10' },
  { label: 'تنوع فعال', value: 1184, icon: Layers, accent: 'text-accent bg-accent/15' },
  { label: 'سفارش‌های امروز', value: 27, icon: ShoppingCart, accent: 'text-chart-4 bg-chart-4/15' },
  { label: 'استعلام جدید', value: 9, icon: MessageSquare, accent: 'text-chart-5 bg-chart-5/15' },
]

function DashboardPage() {
  const { products } = Route.useLoaderData()
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">نمای کلی</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            خلاصه‌ای از وضعیت فروشگاه فرش مریم
          </p>
        </div>
        <Link
          to="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          افزودن محصول
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.accent}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-heading text-2xl font-bold text-foreground">
                {toFa(s.value)}
              </p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">آخرین محصولات</h2>
        <Link
          to="/dashboard/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-foreground hover:underline"
        >
          مشاهده همه
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
      <ProductsTable products={products} limit={4} />
    </div>
  )
}
