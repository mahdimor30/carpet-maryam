import { createFileRoute, Link } from '@tanstack/react-router'

import { useCart } from '@/feature/home/components/cart-provider'

export const Route = createFileRoute('/_layout/checkout')({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: 'تکمیل خرید | فرش مریم' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
})

function CheckoutPage() {
  const { items, total, setQty, remove, clear } = useCart()

  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">فرش مریم</p>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            تکمیل خرید
          </h1>
        </div>
        <Link className="text-sm text-primary underline" to="/">
          بازگشت به فروشگاه
        </Link>
      </div>

      {items.length === 0 ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="mb-3 text-xl font-bold">سبد خرید شما خالی است</h2>
          <p className="mb-6 text-muted-foreground">
            ابتدا یک محصول به سبد خرید اضافه کنید.
          </p>
          <Link
            className="inline-flex rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background"
            to="/products"
          >
            مشاهده محصولات
          </Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            {items.map(({ product, qty }) => (
              <article
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                key={product.id}
              >
                {product.image ? (
                  <img
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover"
                    height={96}
                    src={product.image}
                    width={96}
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label
                      className="text-xs text-muted-foreground"
                      htmlFor={`qty-${product.id}`}
                    >
                      تعداد
                    </label>
                    <input
                      className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-center"
                      id={`qty-${product.id}`}
                      min={1}
                      onChange={(event) =>
                        setQty(product.id, Number(event.target.value))
                      }
                      type="number"
                      value={qty}
                    />
                    <button
                      className="text-xs text-destructive underline"
                      onClick={() => remove(product.id)}
                      type="button"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 text-lg font-bold">خلاصه سفارش</h2>
            <div className="flex justify-between gap-4 text-sm">
              <span>مبلغ کل</span>
              <strong>{total.toLocaleString('fa-IR')} تومان</strong>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              ثبت نهایی سفارش و پرداخت پس از تکمیل اطلاعات ارسال فعال می‌شود.
            </p>
            <button
              className="mt-6 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              onClick={() => clear()}
              type="button"
            >
              پاک‌سازی سبد آزمایشی
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}

export default CheckoutPage
