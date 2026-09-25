import { useState } from 'react'
import { Paperclip, ShieldCheck } from 'lucide-react'

export function CustomOrder() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="bg-secondary/30 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12">
        {/* تصویر */}
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-card shadow-xl">
            <img
              src="/hero.png"
              alt="بافنده فرش مریم در حال کار روی دار قالی سنتی"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-primary-foreground">
              <div className="mb-2 flex items-center gap-2 text-accent">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs">تضمین بافت دست‌اول</span>
              </div>
              <p className="text-sm leading-relaxed">
                ارتباط مستقیم با بیش از ۴۰ کارگاه بافندگی و دار قالی معتبر در
                قطب فرش ایران
              </p>
            </div>
          </div>
        </div>

        {/* متن و فرم */}
        <div className="order-1 flex flex-col items-start gap-5 lg:order-2 lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
            سفارش‌گذاری اختصاصی و ردیابی طرح
          </span>

          <h2 className="text-balance font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            اگر طرح یا سایز موردنظرت را در سایت نیافتی، ما مستقیماً برایت
            می‌بافیم یا تأمین می‌کنیم.
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            شبکه ارتباطی «فرش مریم» در کهن‌شهر کاشان این امکان را به شما می‌دهد
            تا حتی طرح‌های قدیمی ناموجود، اندازه‌های سفارشی برای سالن‌های
            چندضلعی، یا بافت سفارشی با پالت رنگ مدنظرتان را مستقیماً از کارخانه
            پیگیری نمایید.
          </p>

          {/* فرم استعلام سریع */}
          <div className="mt-2 w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-1 text-sm font-bold text-foreground">
              استعلام سریع طرح یا سایز دلخواه
            </h3>
            <p className="mb-5 text-xs text-muted-foreground">
              نام نقشه، سایز مدنظر یا شماره تماس خود را ثبت کنید؛ کارشناسان
              کاشان تا ۲ ساعت کاری با شما تماس می‌گیرند.
            </p>

            {submitted ? (
              <p className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-foreground">
                درخواست شما با موفقیت ثبت شد. کارشناسان ما به‌زودی با شما تماس
                خواهند گرفت.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    نام یا توصیف طرح مدنظر
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="مثلاً: افشان درباری کرم"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    شماره موبایل شما
                  </label>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    placeholder="۰۹۱۲XXXXXXX"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-right text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 pt-1 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Paperclip className="h-4 w-4 text-accent" />
                    <span>امکان ارسال تصویر طرح در گفتگوی بعدی فراهم است</span>
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    ثبت استعلام رایگان
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
