import { ArrowLeft, Sparkles } from 'lucide-react'
import { STATS } from '@/lib/data'
import { Link } from '@tanstack/react-router'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        {/* متن */}
        <div className="flex flex-col gap-6 text-right">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            بیش از ۳۰۰ طرح ماشینی درجه‌یک
          </span>

          <h1 className="text-balance font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            فرش خانه‌ات را
            <br />
            <span className="text-accent">متفاوت</span> کن
          </h1>

          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            از کلاسیک‌ترین طرح‌های سنتی تا مدرن‌ترین دیزاین‌های روز دنیا، همه را
            در یک جا پیدا کن؛ با ضمانت اصالت و ارسال سریع به سراسر کشور.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center rounded-xl border border-border bg-card px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              دسته‌بندی‌ها
            </a>
          </div>

          <dl className="grid grid-cols-4 gap-4 border-t border-border pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-xl font-bold text-foreground">
                  {s.value}
                </dd>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        {/* تصویر */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border shadow-xl">
            <img
              src="/hero-interior.png"
              alt="فرش کلاسیک در دکوراسیون گرم و مدرن"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 right-4 hidden items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex">
            <img
              src="/logo.png"
              alt="فرش مریم"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">ضمانت اصالت</p>
              <p className="text-xs text-muted-foreground">۷ روز بازگشت کالا</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
