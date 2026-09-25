import { Headphones, MessageCircle, Phone } from 'lucide-react'

export function ConsultationBanner() {
  return (
    <section id="consultation" className="mx-4 my-14 sm:mx-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-secondary p-8 md:p-14">
        <div className="relative z-10 flex max-w-3xl flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground">
            <Headphones className="h-4 w-4 text-accent" />
            مشاوره کاملاً رایگان بدون الزام به خرید
          </span>

          <h2 className="text-balance font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            هنوز نمی‌دانی چه فرشی برای خانه‌ات مناسب‌تر است؟
          </h2>

          <p className="text-base leading-relaxed text-muted-foreground">
            ابعاد سالن، پالت رنگی پرده و پارچه مبل‌هایت را به ما بگو؛ کارشناسان
            فرش مریم با سنجش نور و ابعاد چیدمان، متناسب‌ترین نقشه‌ها و شانه را
            به همراه پیش‌نمایش به شما معرفی می‌کنند.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="tel:03155440000"
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <Phone className="h-4 w-4" />
              دریافت مشاوره تلفنی (۰۳۱-۵۵۴۴۰۰۰۰)
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-xl bg-card px-6 py-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-card/70"
            >
              <MessageCircle className="h-4 w-4 text-accent" />
              ارسال عکس فضا در پیام‌رسان
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
