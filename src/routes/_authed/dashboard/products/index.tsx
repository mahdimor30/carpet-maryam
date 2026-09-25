import { ProductsTable } from '@/feature/products/components/products-table'
import { getDb } from '@/server/db'
import { productDrafts } from '@/server/db/schema'
import { desc } from 'drizzle-orm'
import { getProducts } from '@/feature/products/serverFun/get-products'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'

export const Route = createFileRoute('/_authed/dashboard/products/')({
  component: DashboardProductsPage,
  async loader() {
    const products = await getProducts()
    const drafts = await getDb().query.productDrafts.findMany({
      orderBy: [desc(productDrafts.createdAt)],
      limit: 10,
    })
    return { products, drafts }
  },
  head: () => ({
    meta: [
      { title: 'مدیریت محصولات | فرش مریم' },
    ],
  }),
})

function DashboardProductsPage() {
  const { products, drafts } = Route.useLoaderData()
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

      <section className="mb-8 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold">پیش‌نویس‌های AI</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              محصولات دریافت‌شده از روبیکا که هنوز نیاز به بررسی دارند
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            {drafts.length} مورد
          </span>
        </div>
        {drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">هنوز پیش‌نویسی ساخته نشده است.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {drafts.map((draft) => (
              <div key={draft.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{draft.title}</h3>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-800">
                    {draft.status === 'review' ? 'نیازمند بررسی' : draft.status}
                  </span>
                </div>
                {draft.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {draft.description}
                  </p>
                )}
                <div className="mt-3 text-xs text-muted-foreground">
                  اطمینان AI: {Math.round((draft.confidence ?? 0) * 100)}٪ · Draft #{draft.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ProductsTable products={products} />
    </div>
  )
}
