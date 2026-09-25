// این ماژول در head مسیرها استفاده می‌شود و آن کد در کلاینت هم اجرا می‌شود؛
// پس نباید به ماژول‌های انحصاری سرور مثل cloudflare:workers وابسته باشد.
const siteUrl =
  typeof process !== 'undefined' && process.env.SITE_URL
    ? process.env.SITE_URL
    : 'https://farshmaryam.ir'

export const config = {
  siteUrl,
  siteName: 'فرش مریم',
  locale: 'fa_IR',
  defaultOgImage: '/hero-interior.png',
} as const
