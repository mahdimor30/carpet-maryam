import { ArrowLeft, MessageCircle, Phone } from 'lucide-react'

import { PRODUCTS } from '@/lib/data'
import { Link } from '@tanstack/react-router'
import { Hero } from './components/hero'
import { CategoryGrid } from './components/category-grid'
import { ProductCard } from './components/product-card'
import { Features } from './components/features'
import { Footer } from './components/footer'

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* بنر تخفیف
      <div className="bg-accent px-4 py-2.5 text-center text-sm text-accent-foreground">
        ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان —{' '}
        <Link href="/products" className="font-bold underline">
          همین حالا خرید کن
        </Link>
      </div> */}

      <main>
        <Hero />

        <CategoryGrid />

        {/* محصولات ویژه */}
        <section className="border-y border-border bg-card/50 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  محصولات ویژه
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  پرفروش‌ترین‌های این هفته
                </p>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                همه محصولات
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <Features />

        {/* CTA */}
        <section className="mx-4 mb-14 overflow-hidden rounded-3xl bg-primary sm:mx-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-8 py-12 text-right md:flex-row">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary-foreground">
                فرش ایده‌آلت را پیدا نکردی؟
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/70">
                مشاوران ما به‌صورت رایگان در انتخاب کمکت می‌کنند
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <a
                href="tel:02112345678"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                تماس با مشاور
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                <MessageCircle className="h-4 w-4" />
                واتساپ
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
