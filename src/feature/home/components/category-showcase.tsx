import { ArrowLeft, Grid2x2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toFaNumber } from '@/lib/data'
import type { HomeCategory } from '@/feature/products/server/queries/get-home-categories'

// توضیح هر دسته؛ دسته‌های بدون توضیح متن عمومی می‌گیرند.
const DESCRIPTIONS: Record<string, string> = {
  classic: 'طرح‌های لچک‌ترنج، شاه‌عباسی و افشان اصیل کاشان',
  traditional: 'نقشه‌های خشتی و افشان با حال‌وهوای اصیل ایرانی',
  modern: 'نقشه‌های ژئومتریک، پالت‌های خنثی و الیاف ضدلک',
  plain: 'طیف‌های شنی و کرم با بافتی ساده و آرامش‌بخش',
  patine: 'افکت‌های پتینه سنگ، طوسی‌طلایی و بافت‌های شیک دکوراتیو',
  children: 'طرح‌های شاد و کم‌ضرر برای اتاق کودک',
  '3d': 'بافت برجسته با عمق بصری و افکت سه‌بعدی چشم‌نواز',
  fantasy: 'رنگ‌های شاد و طرح‌های امروزی برای فضاهای دنج',
}

export function CategoryShowcase({
  categories,
}: {
  categories: HomeCategory[]
}) {
  if (categories.length === 0) return null

  return (
    <section
      id="categories"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-accent">
            <Grid2x2 className="h-4 w-4" />
            دسته‌بندی‌های تخصصی
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            دنیای فرش مریم
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            مجموعه‌ای منتخب از نفیس‌ترین دستبافته‌ها و بافته‌های مدرن ایرانی؛
            خلق پیوندی میان اصالت کویر و زندگی امروزی.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 pb-1 text-sm font-medium text-accent transition-colors hover:text-foreground"
        >
          مشاهده کاتالوگ جامع طرح‌ها
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to="/categories/$slug"
            params={{ slug: category.slug }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
          >
            <div className="relative h-56 overflow-hidden bg-secondary">
              <img
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-3 right-3 rounded bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                {toFaNumber(category.productCount)} مدل
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {DESCRIPTIONS[category.slug] ??
                    'مجموعه‌ای از فرش‌های این دسته‌بندی با قیمت کارخانه'}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-accent">
                <span>مشاهده کلکسیون</span>
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
