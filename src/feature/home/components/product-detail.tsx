import { ArrowLeft, Check, Heart, Phone, Star, Truck } from 'lucide-react'
import { getProduct, formatPrice, toFaNumber } from '@/lib/data'
import { Link } from '@tanstack/react-router'
import { ProductCard } from './product-card'
import { PRODUCTS } from '@/lib/data'

export function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">محصول یافت نشد</h1>
        <p className="mt-2 text-sm text-muted-foreground">محصولی با این مشخصات وجود ندارد.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به فروشگاه
        </Link>
      </div>
    )
  }

  const related = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
  ).slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* مسیر راهنما */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">خانه</Link>
        <span>/</span>
        <Link to="/products" className="transition-colors hover:text-foreground">فروشگاه</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* تصویر */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.tag && (
            <span className="absolute right-4 top-4 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-primary-foreground">
              {product.tag}
            </span>
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {product.name}
              </h1>
              <button
                aria-label="افزودن به علاقه‌مندی"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-secondary"
              >
                <Heart className="h-5 w-5 text-foreground/50" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {toFaNumber(product.rating)}
              </span>
              <span>{toFaNumber(product.reviews)} نظر</span>
              <span>کد: {product.slug}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-1 text-sm text-muted-foreground">قیمت</div>
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted-foreground">تومان</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* مشخصات */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-bold text-foreground">مشخصات</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[ 
                ['ابعاد', `${product.size} متر`],
                ['تراکم', product.density],
                ['جنس', product.material],
                ['دسته‌بندی', product.category],
                ['طرح', product.design],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* توضیحات */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-2 text-sm font-bold text-foreground">توضیحات</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          {/* ویژگی‌ها */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'ارسال سریع' },
              { icon: Check, text: 'ضمانت اصالت' },
              { icon: ArrowLeft, text: 'مرجوعی آسان' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3"
              >
                <item.icon className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          {/* تماس */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">برای مشاوره و خرید تماس بگیرید</p>
                <a
                  href="tel:09103584996"
                  className="text-lg font-bold text-accent hover:underline"
                  dir="ltr"
                >
                  ۰۹۱۰-۳۵۸-۴۹۹۶
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محصولات مرتبط */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
            محصولات مشابه
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
