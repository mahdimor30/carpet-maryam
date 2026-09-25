import {
  Award,
  Camera,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

const PRODUCT_LINKS = [
  { label: 'فرش دستباف کاشان', href: '/products' },
  { label: 'فرش ۱۲۰۰ شانه', href: '/products' },
  { label: 'فرش ۱۵۰۰ شانه ابریشم', href: '/products' },
  { label: 'تابلو فرش نفیس', href: '/products' },
  { label: 'کلکسیون وینتیج و کهنه‌نما', href: '/products' },
]

const SERVICE_LINKS = [
  { label: 'راهنمای خرید و نگهداری', href: '#' },
  { label: 'پرو مجازی در دکوراسیون', href: '#' },
  { label: 'شرایط تعویض و عودت', href: '#' },
  { label: 'ضمانت اصالت و شناسنامه', href: '#' },
  { label: 'پرسش‌های متداول', href: '#' },
]

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'اینماد' },
  { icon: Shield, label: 'ساماندهی' },
  { icon: Award, label: 'اصالت کالا' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* برند */}
          <div className="lg:col-span-2">
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
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              ارائه مستقیم زیباترین فرش‌های کاشان با قیمت کارخانه، مشاوره تخصصی
              چیدمان و ارسال رایگان تا درب منزل.
            </p>
            <div className="mt-4 flex items-center gap-2">
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

          {/* محصولات */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              محصولات
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((l) => (
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

          {/* خدمات مشتریان */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              خدمات مشتریان
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ارتباط با ما */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              ارتباط با ما
            </h3>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a
                href="tel:03155440000"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
                dir="ltr"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>۰۳۱-۵۵۴۴۰۰۰۰</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>کاشان، خیابان امیرکبیر، گالری فرش مریم</span>
              </div>
              <a
                href="mailto:info@farshmaryam.com"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
                dir="ltr"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@farshmaryam.com</span>
              </a>
            </div>

            {/* نشان‌های اعتماد */}
            <div className="mt-4 flex items-center gap-3">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex h-16 w-14 flex-col items-center justify-center rounded bg-secondary p-1 text-center"
                >
                  <badge.icon className="h-5 w-5 text-secondary-foreground" />
                  <span className="mt-1 text-[9px] leading-none text-muted-foreground">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© ۱۴۰۲ فرش مریم. تمامی حقوق محفوظ است.</p>
          <p className="text-xs text-muted-foreground/80">
            هنر اصیل بافندگان کاشان، بافته شده با تار و پود عشق
          </p>
        </div>
      </div>
    </footer>
  )
}
