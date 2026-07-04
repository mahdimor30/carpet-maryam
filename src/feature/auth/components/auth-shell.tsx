
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

const HIGHLIGHTS = [
  'ضمانت اصالت و رنگ‌بندی اصلی',
  'ارسال سریع به سراسر کشور',
  'پشتیبانی و مشاوره تخصصی خرید فرش',
]

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* پنل تصویری برند */}
      <section className="relative hidden w-full overflow-hidden lg:flex lg:w-1/2">
        <img
          src="/hero-interior.png"
          alt="فضای داخلی با فرش دستباف"
          
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/55" />
        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="فرش مریم"
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl bg-background/90 object-contain p-1"
            />
            <span className="font-heading text-2xl font-bold text-primary-foreground">
              فرش مریم
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="font-heading text-3xl font-bold leading-relaxed text-primary-foreground text-balance xl:text-4xl">
              زیبایی ماندگار، زیر پای شما
            </h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/80">
              با حساب کاربری خود سفارش‌ها را دنبال کنید، لیست علاقه‌مندی بسازید و
              از پیشنهادهای ویژه فرش مریم باخبر شوید.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-primary-foreground/90"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* پنل فرم */}
      <section className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <img
              src="/logo.png"
              alt="فرش مریم"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-heading text-lg font-bold text-primary">
              فرش مریم
            </span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>

            <div className="mt-6">{children}</div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      </section>
    </main>
  )
}
