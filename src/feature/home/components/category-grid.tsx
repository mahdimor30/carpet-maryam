import { ArrowLeft } from 'lucide-react'
import { PRODUCTS } from '@/lib/data'
import { Link } from '@tanstack/react-router'
import { useCategories } from '@/feature/products/hooks/use-categories'

// تصویر نماینده برای هر دسته از روی محصولات
function categoryImage(slug: string) {
  return (
    PRODUCTS.find((p) => p.categorySlug === slug)?.image || '/placeholder.svg'
  )
}

export function CategoryGrid() {
  const { data } = useCategories()
  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            دسته‌بندی‌ها
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            سبکی که می‌پسندی را انتخاب کن
          </p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          همه دسته‌ها
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
      {/* {data?.map((item) => (
        <div>{item.name}</div>
      ))} */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {data?.map((cat) => (
          <Link
            key={cat.slug}
            to="/products"
            search={{ cat: cat.slug }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={categoryImage(cat.slug) || '/placeholder.svg'}
                alt={cat.name}
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-sm font-semibold text-foreground">
                {cat.name}
              </p>
              {/* <p className="mt-0.5 text-xs text-muted-foreground">
                {toFaNumber(cat.count)} مدل
              </p> */}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
