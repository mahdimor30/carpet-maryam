import { Truck, BadgeCheck, RotateCcw, Headphones } from 'lucide-react'

const FEATURES = [
  {
    icon: Truck,
    title: 'ارسال سریع',
    desc: 'تحویل ۲ تا ۵ روزه در سراسر کشور',
  },
  {
    icon: BadgeCheck,
    title: 'ضمانت اصالت',
    desc: 'تمامی محصولات دارای گواهی کیفیت',
  },
  {
    icon: RotateCcw,
    title: 'مرجوعی آسان',
    desc: '۷ روز ضمانت بازگشت بدون سوال',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴/۷',
    desc: 'مشاوران ما همیشه در دسترس‌اند',
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
