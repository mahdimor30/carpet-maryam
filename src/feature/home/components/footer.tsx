
import { Camera, Phone, Send } from 'lucide-react'
import { CATEGORIES } from '@/lib/data'
import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* برند */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="فرش مریم"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="font-heading text-lg font-bold text-primary">
                فرش مریم
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              تولید و عرضه‌ی فرش ماشینی با کیفیت، از طرح‌های اصیل سنتی تا
              دیزاین‌های مدرن روز دنیا.
            </p>
          </div>

          {/* دسته‌بندی‌ها */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              دسته‌بندی‌ها
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to="/products"
                    search={{ cat: cat.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* لینک‌ها */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              دسترسی سریع
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                { label: 'فروشگاه', href: '/products' },
                { label: 'درباره ما', href: '#' },
                { label: 'راهنمای خرید', href: '#' },
                { label: 'شرایط مرجوعی', href: '#' },
                { label: 'تماس با ما', href: '#' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              ارتباط با ما
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="tel:02112345678"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                dir="ltr"
              >
                <Phone className="h-4 w-4 text-accent" />
                <span>۰۲۱ - ۱۲۳۴ ۵۶۷۸</span>
              </a>
              <div className="mt-1 flex items-center gap-2">
                <a
                  href="#"
                  aria-label="اینستاگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Camera className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="تلگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Send className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © تمامی حقوق برای فرش مریم محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  )
}
