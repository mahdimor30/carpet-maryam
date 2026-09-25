import {
  ArrowLeft,
  BadgeCheck,
  Factory,
  MessagesSquare,
  Palette,
  Truck,
} from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Palette, title: 'بیش از ۵۰۰ طرح', desc: 'نقشه‌های اصیل و نوآورانه' },
  { icon: Factory, title: 'مستقیم از کاشان', desc: 'حذف واسطه و سود دلال' },
  { icon: Truck, title: 'ارسال رایگان', desc: 'بسته‌بندی لول و بیمه‌شده' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:py-20">
        {/* متن و اکشن‌ها */}
        <div className="flex flex-col items-start gap-8 lg:col-span-7">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-secondary px-4 py-1.5 text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium tracking-wide">
              اصالت هنر کاشان • عرضه مستقیم از کارخانه
            </span>
          </span>

          <div className="max-w-2xl space-y-4">
            <h1 className="text-balance font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              خرید فرش ماشینی و دستباف کاشان؛{' '}
              <span className="font-normal text-accent underline decoration-secondary decoration-4 underline-offset-8">
                مناسب خانه‌ات
              </span>{' '}
              را پیدا کن
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              تنوعی از اصیل‌ترین طرح‌های دستباف و مدرن ماشینی کاشان؛ با قیمت
              منصفانه کارخانه، ضمانت شناسنامه اصالت و امکان تهیه بدون واسطه
              دلالان.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
            <a
              href="#featured-products"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-foreground px-8 py-4 text-sm font-medium text-background shadow-md transition-all hover:opacity-90 sm:w-auto"
            >
              مشاهده فرش‌ها
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </a>
            <a
              href="#consultation"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-secondary px-7 py-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/70 sm:w-auto"
            >
              <MessagesSquare className="h-5 w-5 text-primary" />
              مشاوره انتخاب فرش
            </a>
          </div>

          {/* نوار نشان‌های برجسته */}
          <div className="w-full rounded-2xl bg-card/60 p-4 backdrop-blur">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* نمایش بصری نامتقارن */}
        <div className="relative mt-4 lg:col-span-5 lg:mt-0">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute -inset-4 -rotate-2 rounded-3xl bg-secondary/60" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card shadow-xl">
              <img
                src="/hero-interior.png"
                alt="فرش ابریشمی طرح افشان عاجی زرین در دکوراسیون گرم و مدرن"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-background">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-90">
                    کلکسیون نگارستان
                  </span>
                  <p className="font-heading text-lg font-semibold">
                    طرح افشان عاجی زرین
                  </p>
                  <p className="mt-0.5 text-xs opacity-80">
                    ۱۵۰۰ شانه ابریشم‌گونه بافت ویژه
                  </p>
                </div>
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                  کد: KSH-409
                </span>
              </div>
            </div>

            {/* کارت شناور */}
            <div className="absolute -top-6 -right-6 hidden items-center gap-3 rounded-xl bg-card p-4 shadow-lg sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">ضمانت رسمی</p>
                <p className="text-sm font-bold text-foreground">
                  ۱۰ سال ضمانت الیاف
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
