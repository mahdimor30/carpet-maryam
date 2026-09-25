import { useState } from 'react'
import { Eye, Heart, ShoppingCart } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { formatPrice, toFaNumber } from '@/lib/data'
import type { HomeProduct } from '@/feature/products/server/queries/get-home-products'
import { useCart } from './cart-provider'

// خط مشخصات فنی کارت؛ از فیلدهای واقعی محصول ساخته می‌شود.
function specLine(product: HomeProduct) {
  const specs: string[] = []

  if (product.density) specs.push(`تراکم ${toFaNumber(product.density)}`)
  if (product.yarn) specs.push(product.yarn)

  if (specs.length > 0) return specs.join(' • ')
  return product.description
}

function FeaturedCard({ product }: { product: HomeProduct }) {
  const [wished, setWished] = useState(false)
  const { add } = useCart()

  const specs = specLine(product)
  const discountLabel = product.discountPercent
    ? `${toFaNumber(product.discountPercent)}٪ تخفیف`
    : null

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {discountLabel && (
            <span className="rounded bg-destructive px-2.5 py-1 text-xs font-bold text-primary-foreground shadow">
              {discountLabel}
            </span>
          )}
          {product.category && (
            <span className="rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {product.category.name}
            </span>
          )}
          {product.shaneh && (
            <span className="rounded bg-background/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
              {toFaNumber(product.shaneh)} شانه
            </span>
          )}
        </div>

        <button
          onClick={() => setWished((v) => !v)}
          aria-label="افزودن به علاقه‌مندی"
          className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={`h-[18px] w-[18px] ${wished ? 'fill-destructive text-destructive' : ''}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {specs && (
            <span className="line-clamp-1 text-xs font-light text-muted-foreground">
              {specs}
            </span>
          )}
          <h3 className="mt-1 line-clamp-1 font-heading text-base font-semibold text-foreground">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div className="flex flex-col">
              {product.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)} تومان
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="font-heading text-base font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-muted-foreground">تومان</span>
              </div>
            </div>
            {product.size && (
              <span className="rounded bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                {toFaNumber(product.size)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => add(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground py-2.5 text-xs font-semibold text-background transition-colors hover:opacity-90"
            >
              <ShoppingCart className="h-4 w-4" />
              خرید سریع
            </button>
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              aria-label="جزئیات"
              className="flex items-center justify-center rounded-lg bg-secondary p-2.5 text-foreground transition-colors hover:bg-secondary/70"
            >
              <Eye className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeaturedProducts({ products }: { products: HomeProduct[] }) {
  return (
    <section id="featured-products" className="border-y border-border bg-card/50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-medium text-accent">
              پرفروش‌ترین‌های کارخانه
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              انتخاب‌های محبوب
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              فرش‌هایی که جلوه‌ای ماندگار به منازل ایرانی بخشیده‌اند
            </p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            مشاهده همه محصولات
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-muted-foreground">
              هنوز محصولی برای نمایش ثبت نشده است.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <FeaturedCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
