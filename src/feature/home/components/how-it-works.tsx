import { toFaNumber } from '@/lib/data'

const STEPS = [
  {
    title: 'فرش دلخواه‌تان را انتخاب کنید',
    desc: 'جستجو و مقایسه هوشمند بر اساس شانه، تراکم، طرح و ابعاد دقیق فضای نشیمن یا اتاق‌خواب.',
  },
  {
    title: 'مشاوره رایگان و تست چیدمان',
    desc: 'در صورت نیاز عکس فضای خانه را بفرستید تا شبیه‌سازی دیجیتال و تطابق رنگ برایتان انجام شود.',
  },
  {
    title: 'بررسی موجودی کارخانه کاشان',
    desc: 'کنترل نهایی بافت توسط کارشناس کیفی نساجی، صدور شناسنامه اصالت کالا و بسته‌بندی محکم ضدآب.',
  },
  {
    title: 'تحویل امن و سریع درب منزل',
    desc: 'تحویل پاکیزه و ایمن در کلیه نقاط ایران با هماهنگی تلفنی و اطمینان خاطر از سلامت کامل محصول.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          فرآیند آسان ۴ مرحله‌ای
        </span>
        <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          خرید فرش، ساده‌تر از همیشه
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          تجربه خریدی لذت‌بخش و شفاف از نخستین انتخاب نقشه تا لمس لطافت تار و
          پود در خانه
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-8 right-12 left-12 hidden h-px bg-border lg:block" />

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-2xl bg-card/80 p-6 text-center shadow-sm backdrop-blur"
            >
              <div
                className={`mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold ring-8 ring-background ${
                  i === 0
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-foreground shadow-sm'
                }`}
              >
                {toFaNumber(i + 1)}
              </div>
              <h3 className="mb-2 text-sm font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
