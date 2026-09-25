import { ArrowLeft, Layers3, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { CATEGORIES, PRODUCTS, toFaNumber } from '@/lib/data'

function categoryImage(slug: string) {
  return (
    PRODUCTS.find((product) => product.categorySlug === slug)?.image ??
    '/placeholder.svg'
  )
}

export function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          خانه
        </Link>
        <span>/</span>
        <span className="text-foreground">دسته‌بندی‌ها</span>
      </nav>

      <section className="mb-10 overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-9">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-foreground">
            <Layers3 className="h-4 w-4 text-accent" />
            انتخاب بر اساس سبک
          </span>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            دسته‌بندی فرش‌ها
          </h1>
          <p className="leading-7 text-muted-foreground">
            از طرح‌های کلاسیک و اصیل تا مدل‌های مدرن، پتینه و فانتزی؛ دسته مورد
            نظرت را انتخاب کن و محصولات همان سبک را یک‌جا ببین.
          </p>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const count = PRODUCTS.filter(
            (product) => product.categorySlug === category.slug,
          ).length
          return (
            <Link
              key={category.slug}
              to="/categories/$slug"
              params={{ slug: category.slug }}
              className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <img
                  src={categoryImage(category.slug)}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 text-primary-foreground">
                  <h2 className="font-heading text-2xl font-bold">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-xs text-primary-foreground/80">
                    {toFaNumber(count)} محصول موجود
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-accent" /> مشاهده مدل‌ها
                </span>
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
