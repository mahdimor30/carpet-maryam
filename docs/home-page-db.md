# تغییرات: خواندن محصولات صفحه اصلی از دیتابیس

این سند همه‌ی کارهایی را که برای «گرفتن محصولات صفحه اصلی از دیتابیس» انجام شد، همراه با
دلیل هر تصمیم، دستورهای اجرا و نتیجه‌ی تست‌ها توضیح می‌دهد.

---

## ۱. خلاصه

قبلاً سه بخش صفحه اصلی از داده‌های هاردکد `src/lib/data.ts` تغذیه می‌شدند:

- کارت‌های «انتخاب‌های محبوب» از آرایه‌ی `FEATURED` داخل کامپوننت
- «دنیای فرش مریم» (دسته‌بندی‌ها) از `CATEGORIES` و تصویر دسته از `PRODUCTS`
- «الهام بگیر» (گالری) از `PRODUCTS.slice(0, 6)`

الان هر سه مستقیم از جدول‌های D1 خوانده می‌شوند:

```
D1 (products / product_variants / variant_images / categories / ...)
        │
        │  کوئری‌های drizzle در لایه server/queries
        ▼
getFeaturedProducts(4) + getGalleryProducts(6) + getHomeCategories(6)
        │
        │  سرورفانکشن GET (یک رفت‌وبرگشت)
        ▼
getHomeProductsFn  ──►  loader مسیر /_layout/
        │
        ▼
HomePage({ featuredProducts, galleryProducts, categories })  ──►  سه کامپوننت صفحه اصلی
```

---

## ۲. فایل‌های جدید

| فایل | نقش |
| --- | --- |
| `src/feature/products/server/queries/get-home-products.ts` | کوئری محصولات صفحه اصلی + تایپ `HomeProduct` |
| `src/feature/products/server/queries/get-home-categories.ts` | کوئری دسته‌بندی‌ها + تایپ `HomeCategory` |
| `src/feature/products/server/functions/get-home-products.ts` | سرورفانکشن `getHomeProductsFn` (متد GET) |

### `getHomeProducts.ts` — دو تابع خروجی

- `getFeaturedProducts(limit = 4)` → «انتخاب‌های محبوب»؛ محصولات دارای تخفیف اولویت دارند.
- `getGalleryProducts(limit = 6)` → «الهام بگیر»؛ آخرین محصولات ثبت‌شده.

هر دو روی یک تابع داخلی (`fetchHomeProducts`) سوارند و فقط در ترتیب فرق می‌کنند.

### شکل داده‌ی خروجی (`HomeProduct`)

```ts
{
  id, slug, name, description, brand,
  image,                 // نشانی تصویر اصلی (primary)
  price,                 // قیمت ارزان‌ترین تنوع فعال
  compareAtPrice,        // فقط اگر واقعاً بزرگ‌تر از price باشد، وگرنه null
  discountPercent,       // درصد تخفیف محاسبه‌شده
  size,                  // ابعاد ارزان‌ترین تنوع
  shaneh, density, yarn, warrantyMonths,
  stock, variantCount,
  category: { name, slug } | null,
  design:   { name, slug } | null,
  material: { name, slug } | null,
}
```

قواعد انتخاب که همه در SQL پیاده شده‌اند:

- فقط محصولات `is_active = 1` که **حداقل یک تنوع فعال** دارند نمایش داده می‌شوند.
- قیمت = `MIN(price)` بین تنوع‌های فعال.
- `compareAtPrice` و `size` از همان ارزان‌ترین تنوع (`ORDER BY price, id LIMIT 1`) خوانده می‌شوند تا قیمت خط‌خورده و ابعاد با هم هم‌خوان باشند.
- تصویر = اولین تصویرِ تنوع‌های فعال با ترتیب `is_primary DESC, sort_order ASC, id ASC`.
- نام دسته/طرح/جنس = اولین رکورد متصل در جدول‌های واسط (`product_categories` و …).

### `getHomeCategories.ts`

- تعداد محصول فعال هر دسته به‌صورت شمارش همبسته محاسبه می‌شود.
- تصویر دسته = `COALESCE(categories.image, تصویر اولین محصول آن دسته)`.
- ترتیب: بیشترین محصول اول؛ محدودیت ۶ دسته.

### چرا زیرکوئری‌ها SQL خام‌اند (نکته مهم برای نگهداری)

اگر ستون‌ها را با `${productVariants.price}` داخل `sql` بگذارید، Drizzle در **فهرست `SELECT`**
نام جدول را حذف می‌کند و خروجی چیزی مثل این می‌شود:

```sql
SELECT (SELECT MIN("price") FROM "product_variants"
        WHERE "product_id" = "id" AND "is_active" = 1) ...
```

که هم معنایش غلط است (ارجاع `"id"` به جدول داخلی می‌خورد نه `products`) و هم در JOINها به
خطای «ambiguous column» می‌رسد. به همین دلیل زیرکوئری‌ها به‌صورت متن صریح و با نام کامل جدول
نوشته شده‌اند:

```sql
SELECT MIN(product_variants.price)
FROM product_variants
WHERE product_variants.product_id = products.id
  AND product_variants.is_active = 1
```

اگر روزی نام جدول/ستونی عوض شد، این کوئری‌ها هم باید دستی به‌روز شوند.

---

## ۳. فایل‌های تغییر‌یافته

| فایل | تغییر |
| --- | --- |
| `src/routes/_layout/index.tsx` | `loader` اضافه شد که `getHomeProductsFn()` را صدا می‌زند و `HomeRoute` داده را با `Route.useLoaderData()` به `HomePage` پاس می‌دهد |
| `src/feature/home/index.tsx` | `HomePage` سه prop گرفت: `featuredProducts`، `galleryProducts`، `categories` |
| `src/feature/home/components/featured-products.tsx` | آرایه‌ی هاردکد `FEATURED` حذف شد؛ کارت از `HomeProduct` رندر می‌شود (تخفیف/شانه/دسته/قیمت خط‌خورده/ابعاد از دیتابیس) |
| `src/feature/home/components/category-showcase.tsx` | از `categories` پراپ؛ تصویر و تعداد از دیتابیس، توضیح متنی هر اسلاگ با متن پیش‌فرض |
| `src/feature/home/components/instagram-gallery.tsx` | از `products` پراپ (۶ محصول آخر)؛ کپشن از نام طرحِ محصول |
| `src/feature/home/components/cart-provider.tsx` | تایپ `CartProduct` به‌جای `Product` کتابخانه‌ی نمونه؛ حالا هم محصول دیتابیس و هم داده‌های نمونه‌ی قدیمی را می‌پذیرد |
| `src/feature/home/components/cart-drawer.tsx` | نمایش ابعاد با ارقام فارسی و بدون پسوند تکراری «متر» (چون `dimension` خودش «۶ متری» است) |
| `seed.sql` | اصلاح کامل (بخش ۵) |
| `src/server/config.ts` | کلاینت‌سِیف شد (بخش ۶) |
| `wrangler.jsonc` | `"remote": false` برای dev (بخش ۷) |

نکته: مسیر `/_layout/index.tsx` بعداً توسط خودتان به `createSeo` و `src/lib/seo.ts` وصل شد؛
لودر و پاس‌دادن داده دست‌نخورده باقی مانده است.

---

## ۴. رفتار در حالت دیتابیس خالی

- بخش «انتخاب‌های محبوب» با پیام «هنوز محصولی برای نمایش ثبت نشده است.» نشان داده می‌شود.
- بخش دسته‌بندی و گالری در صورت نبود داده کلاً رندر نمی‌شوند (`return null`) تا صفحه‌ی خالی و شکسته نداشته باشیم.

---

## ۵. اصلاح `seed.sql`

### مشکل

`seed.sql` هیچ رکوردی درج نمی‌کرد، چون اسکریپت قبل از مهاجرت‌های ۰۰۰۱+ نوشته شده و فرض می‌کرد
`created_at` متن با مقدار پیش‌فرض است. اسکیمای فعلی چنین است:

```sql
`created_at` integer NOT NULL     -- بدون DEFAULT
```

و مقداردهی این ستون‌ها فقط از مسیر Drizzle (`$defaultFn`) انجام می‌شود؛ پس درج خام SQL با خطای
`NOT NULL constraint failed` رد می‌شد. نتیجه: دیتابیس لوکال و ریموت هر دو صفر محصول داشتند و
صفحه اصلی عملاً خالی بود.

### تغییرات

1. همه‌ی درج‌ها `strftime('%s','now')` (ثانیه‌ی یونیکس) برای `created_at`/`updated_at` می‌گیرند — همان قالبی که Drizzle با `mode: 'timestamp'` انتظار دارد.
2. `CURRENT_TIMESTAMP`های متنی (در `factory_inventory.checked_at` و `factory_quotes.valid_from`) با همان `strftime` جایگزین شدند.
3. بخش «Variant Images» اضافه شد: برای هر محصول یک تصویر اصلی از فایل‌های موجود `public/carpets/*.png` (`is_primary = 1`, `type = 'main'`) و برای دو محصول یک تصویر گالری غیراصلی، تا منطق انتخاب تصویر اصلی واقعاً تست شود.
4. **Idempotent** شد: برای `variant_images`، `factory_products`، `factory_inventory` و `factory_quotes` شرط `NOT EXISTS` اضافه شد تا اجرای دوباره رکورد تکراری نسازد.

### دستورها

```bash
# دیتابیس لوکال (اگر تازه است، اول مهاجرت‌ها)
bunx wrangler d1 migrations apply carpet-maryam-db --local
bunx wrangler d1 execute carpet-maryam-db --local --file=seed.sql

# دیتابیس زنده (اجرا نشد؛ نیاز به تأیید شما دارد چون روی داده زنده می‌نویسد)
bunx wrangler d1 execute carpet-maryam-db --remote --file=seed.sql
```

---

## ۶. باگی که کار صفحه را متوقف می‌کرد: هیدریشن کلاینت

`src/server/config.ts` از `cloudflare:workers` ایمپورت می‌کرد:

```ts
import { env } from 'cloudflare:workers'
export const config = { siteUrl: env.SITE_URL, ... }
```

و چون `src/lib/seo.ts` (که `createSeo` را می‌سازد) در `head` مسیر خانه استفاده می‌شود و `head`
در کلاینت هم اجرا می‌شود، این ماژول وارد باندل کلاینت می‌شد. Vite نمی‌تواند `cloudflare:workers`
را برای کلاینت resolve کند، بنابراین کل باندل کلاینت نمی‌آمد:

- صفحه SSR می‌شد ولی **هیچ کلیکی کار نمی‌کرد** (سبد خرید، منوی موبایل، علاقه‌مندی)
- در dev روی صفحه overlay خطای Vite ظاهر می‌شد

اصلاح: خواندن مقدار با گارد و پیش‌فرض، بدون وابستگی به ماژول سروری:

```ts
const siteUrl =
  typeof process !== 'undefined' && process.env.SITE_URL
    ? process.env.SITE_URL
    : 'https://farshmaryam.ir'
```

اگر بعداً بخواهید مقدارها محیطی شوند، راه درستش استفاده از `import.meta.env.VITE_*` است، نه
`cloudflare:workers` در ماژولی که در کلاینت هم خوانده می‌شود.

---

## ۷. تنظیم `wrangler.jsonc`

- `"remote": true` بود؛ یعنی `bun run dev` مستقیم روی **D1 زنده** کار می‌کرد. برای تست، مقدارش را `false` گذاشتم تا dev از D1 لوکال بخواند و همان‌جا ماند.
- اثرش: در dev، همه‌ی خواندن/نوشتن‌ها (از جمله داشبورد) روی دیتابیس لوکال انجام می‌شود و خطر دست‌خوردن داده زنده در حین توسعه وجود ندارد.
- اگر می‌خواهید dev دوباره روی داده زنده کار کند، `"remote": true` کنید. توجه کنید که دیتابیس زنده الان خالی است و در آن حالت صفحه اصلی پیام «محصولی ثبت نشده» نشان می‌دهد تا وقتی seed را روی ریموت اجرا کنید.
- نکته‌ی پیش‌رندر: چون `tanstackStart({ prerender: { enabled: true, filter: '/' } })` فعال است، `vite build` هم صفحه اصلی را با همان دیتابیسی می‌سازد که تنظیم شده. با `remote: false`، HTML پیش‌رندر‌شده از کاتالوگ **لوکال** ساخته می‌شود؛ پس تا یک build دوباره، خروجی deploy همان داده لوکال را نشان می‌دهد.

---

## ۸. نتیجه‌ی تست‌ها

**محیط dev (دیتابیس لوکال با ۶ محصول، ۱۱ تنوع، ۸ تصویر):**

| بررسی | نتیجه |
| --- | --- |
| کارت‌های منتخب | ۴ کارت با نام، قیمت، قیمت خط‌خورده، درصد تخفیف (`۱۲٪`/`۱۵٪`/`۱۵٪`/`۱۱٪`)، شانه، تراکم، ابعاد فارسی |
| دسته‌بندی‌ها | ۴ کارت با شمارش درست (کلاسیک ۳، مدرن ۲، سنتی ۱، کودک ۱) و تصویر جانشین از محصول |
| گالری | ۶ محصول آخر با تصویر |
| انتخاب تصویر اصلی | برای محصولی که هم تصویر گالری دارد هم اصلی، تصویر `is_primary` انتخاب شد (تصویر گالری رندر نشد) |
| افزودن به سبد | دکمه «خرید سریع» روی محصول دیتابیسی → نشان سبد `۱`، نام/ابعاد/قیمت درست در کشو |
| خطای SQL | هیچ خطای D1 در لاگ و در HTML نبود |

**تایپ و build:**

- `bunx tsc --noEmit`: تعداد خطاها با قبل از تغییرات یکسان است (۱۱۲ مورد، همه از قبل موجود) و هیچ خطای جدیدی در فایل‌های این تسک نیست.
- `bun run build`: موفق؛ پیش‌رندر `GET / 200 OK` و در `dist/client/index.html` نام محصولات، دسته‌ها و تصاویر دیتابیس موجود است.

**Idempotency:** اجرای دوباره‌ی `seed.sql` روی دیتابیس لوکال تعداد رکوردها را تغییر نداد
(۶ محصول، ۱۱ تنوع، ۸ تصویر، ۱۱ رکورد کارخانه).

---

## ۹. موارد باز (خارج از این تسک)

1. `console.log('home loder')` در لودر مسیر خانه باقی مانده است.
2. مسیر `/checkout` کامنت شده و کامپوننت `checkout-page` وجود ندارد؛ در نتیجه لینک «تکمیل خرید» در `cart-drawer.tsx` به مسیر ناموجود اشاره می‌کند (یک خطای تایپ و یک ۴۰۴).
3. صفحه‌های «فروشگاه»، «جزئیات محصول» و «دسته‌بندی» هنوز از داده‌های نمونه‌ی `src/lib/data.ts` می‌خوانند (`products-browser`, `product-detail`, `category-page`, `category-grid`) و سبد خرید فعلاً کلاینت‌ساید (localStorage) است، نه متصل به سبد سروری.
4. دیتابیس زنده خالی است؛ برای پر کردن آن باید seed ریموت اجرا شود یا محصولات واقعی از داشبورد ثبت شوند.
5. طرح‌های «۳بعدی» و «ساده‌بافت» که فایل تصویرشان در `public/carpets` هست، در seed به‌عنوان تصویر گالری دو محصول استفاده شده‌اند؛ اگر بعداً محصول واقعی برایشان اضافه شد، تصویرها را جابه‌جا کنید.
