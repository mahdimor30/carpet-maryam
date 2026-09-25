import { Armchair, Layers, ShieldCheck, Tags } from 'lucide-react'

const VALUE_PROPS = [
  {
    icon: Tags,
    title: 'قیمت مستقیم کارخانه',
    desc: 'حذف دلالان و سودهای نامتعارف بازار واسطه‌ای با دسترسی مستقیم و تضمین‌شده به نرخ دست‌اول کارخانجات معتبر کاشان.',
  },
  {
    icon: Layers,
    title: 'تنوع بی‌نظیر و نامحدود',
    desc: 'صدها طرح، نقشه سنتی و مدرن در ابعاد استاندارد و نامتعارف، سازگار با هر نوع سبک مبلمان و پالت رنگی فضای منزل شما.',
  },
  {
    icon: Armchair,
    title: 'مشاوره تخصصی چیدمان',
    desc: 'امکان ارسال تصویر سالن، ابعاد مبلمان و نورگیر خانه جهت دریافت مشاوره رایگان تناسب رنگ و پرو مجازی فرش قبل از خرید.',
  },
  {
    icon: ShieldCheck,
    title: 'ارسال امن و بیمه‌شده',
    desc: 'بسته‌بندی دولایه استاندارد صنعتی به‌صورت لول بدون تاخوردگی تار و پود، همراه با بیمه سلامت کالا تا تحویل درب منزل.',
  },
]

export function ValueProps() {
  return (
    <section className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            تعهدات و استانداردهای ما
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            چرا فرش مریم؟
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            ما فاصله بین دستگاه بافنده تا سالن پذیرایی شما را با شفافیت،
            احترام و کیفیت کوتاه کرده‌ایم.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-start rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-sm font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
