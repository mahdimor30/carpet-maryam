import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, PRODUCTS, toFaNumber } from '@/lib/data'
import { ProductCard } from '@/feature/home/components/product-card'

const SORT_OPTIONS = [
  { value: 'popular', label: 'پرطرفدارترین' },
  { value: 'cheap', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

export function ProductsBrowser({ initialCat }: { initialCat: string }) {
  const [cat, setCat] = useState(initialCat)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortValue>('popular')

  const products = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) => cat === 'all' || p.categorySlug === cat,
    )
    const trimmed = query.trim().toLowerCase()
    if (trimmed) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed),
      )
    }
    const sorted = [...list]
    switch (sort) {
      case 'cheap':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'expensive':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sorted.sort((a, b) => b.id - a.id)
        break
      default:
        sorted.sort((a, b) => b.reviews - a.reviews)
    }
    return sorted
  }, [cat, query, sort])

  const filters = [{ slug: 'all', name: 'همه' }, ...CATEGORIES]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* سرصفحه */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          فروشگاه فرش
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {toFaNumber(products.length)} محصول یافت شد
        </p>
      </div>

      {/* جستجو و مرتب‌سازی */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی فرش..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pr-10 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="bg-transparent py-1.5 text-sm text-foreground outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* فیلتر دسته */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.slug}
            onClick={() => setCat(f.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === f.slug
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-foreground/70 hover:bg-secondary'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* شبکه محصولات */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            محصولی با این مشخصات پیدا نشد.
          </p>
        </div>
      )}
    </div>
  )
}
