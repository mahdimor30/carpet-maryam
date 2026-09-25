import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { CATEGORIES, PRODUCTS, toFaNumber } from '@/lib/data'
import { ProductCard } from './product-card'

const DESCRIPTIONS: Record<string, string> = {
  classic: 'طرح‌های اصیل و پرجزئیات برای پذیرایی‌های رسمی و دکوراسیون ایرانی.',
  modern: 'ترکیب رنگ‌های آرام و فرم‌های مینیمال برای فضاهای امروزی.',
  plain: 'بافت ساده و رنگ‌های خنثی برای دکوراسیون‌های خلوت و کاربردی.',
  patine: 'ظاهر وینتیج و کهنه‌نما با حس گرم و لوکس برای فضاهای خاص.',
  '3d': 'بافت برجسته و عمق بصری بیشتر برای دکوراسیون‌های چشمگیر.',
  fantasy: 'طرح‌های خلاقانه و متفاوت برای اتاق خواب، کودک و فضاهای صمیمی.',
}

export function CategoryPage({ slug }: { slug: string }) {
  const category = CATEGORIES.find((item) => item.slug === slug)
  const products = PRODUCTS.filter((product) => product.categorySlug === slug)

  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold">دسته‌بندی پیدا نشد</h1>
        <Link to="/categories" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm text-primary-foreground">
          مشاهده همه دسته‌بندی‌ها
        </Link>
      </main>
    )
  }

  const heroImage = products[0]?.image ?? '/placeholder.svg'

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">خانه</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-foreground">دسته‌بندی‌ها</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <section className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/90 to-primary/40" />
        <div className="relative max-w-2xl p-7 sm:p-10">
          <p className="mb-3 text-sm text-primary-foreground/70">دسته‌بندی فرش</p>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">فرش {category.name}</h1>
          <p className="mt-4 max-w-xl leading-7 text-primary-foreground/75">{DESCRIPTIONS[slug]}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-primary-foreground/80">
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-accent" /> ضمانت اصالت</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-accent" /> ارسال سراسری</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-accent" /> مشاوره خرید</span>
          </div>
        </div>
      </section>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">محصولات {category.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{toFaNumber(products.length)} محصول در این دسته</p>
        </div>
        <Link to="/products" search={{ cat: category.slug }} className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:flex">
          نمایش در فروشگاه <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          در حال حاضر محصولی در این دسته موجود نیست.
        </div>
      )}

      <section className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg font-bold">سبک دیگری مد نظرت است؟</h3>
          <p className="mt-1 text-sm text-muted-foreground">همه دسته‌ها را ببین و راحت‌تر مقایسه کن.</p>
        </div>
        <Link to="/categories" className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-medium">
          همه دسته‌بندی‌ها <ArrowLeft className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
