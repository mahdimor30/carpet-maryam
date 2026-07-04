// ─── داده‌های نمونه فروشگاه فرش مریم ───────────────────────

export type Category = {
  slug: string
  name: string
  count: number
}

// طرح‌ها (designs) - محور مستقل طبقه‌بندی، مطابق جدول designs در اسکیما
export type Design = {
  slug: string
  name: string
  count: number
}

// متریال‌ها (materials) - محور مستقل طبقه‌بندی، مطابق جدول materials در اسکیما
export type MaterialTaxon = {
  slug: string
  name: string
  count: number
}

export type Product = {
  id: number
  slug: string
  name: string
  categorySlug: string
  category: string
  designSlug: string
  design: string
  materialSlug: string
  size: string
  price: number
  originalPrice: number | null
  tag: string | null
  rating: number
  reviews: number
  image: string
  description: string
  density: string
  material: string
}

export const CATEGORIES: Category[] = [
  { slug: 'classic', name: 'کلاسیک', count: 84 },
  { slug: 'modern', name: 'مدرن', count: 61 },
  { slug: 'plain', name: 'ساده‌بافت', count: 47 },
  { slug: 'patine', name: 'پتینه', count: 38 },
  { slug: '3d', name: 'سه‌بعدی', count: 29 },
  { slug: 'fantasy', name: 'فانتزی', count: 53 },
]

// طرح‌ها - هم‌راستا با DASH_DESIGNS در lib/dashboard-data.ts
export const DESIGNS: Design[] = [
  { slug: 'traditional', name: 'سنتی', count: 96 },
  { slug: 'modern', name: 'مدرن', count: 58 },
  { slug: 'gabbeh', name: 'گبه', count: 34 },
  { slug: 'afshan', name: 'افشان', count: 27 },
  { slug: 'lachak-toranj', name: 'لچک ترنج', count: 41 },
  { slug: 'geometric', name: 'هندسی', count: 22 },
]

// متریال‌ها - هم‌راستا با DASH_MATERIALS در lib/dashboard-data.ts
export const MATERIALS: MaterialTaxon[] = [
  { slug: 'acrylic', name: 'اکریلیک', count: 112 },
  { slug: 'nylon', name: 'نایلون', count: 19 },
  { slug: 'silk', name: 'ابریشم', count: 8 },
  { slug: 'polypropylene', name: 'پلی‌پروپیلن', count: 47 },
  { slug: 'polyester', name: 'پلی‌استر', count: 31 },
  { slug: 'wool', name: 'پشم', count: 14 },
]

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'arta-1200',
    name: 'آرتا ۱۲۰۰ شانه',
    categorySlug: 'classic',
    category: 'کلاسیک',
    designSlug: 'lachak-toranj',
    design: 'لچک ترنج',
    materialSlug: 'acrylic',
    size: '۱.۵ × ۲.۲۵',
    price: 4800000,
    originalPrice: 5500000,
    tag: 'پرفروش',
    rating: 4.8,
    reviews: 213,
    image: '/carpets/classic-arta.png',
    description:
      'فرش کلاسیک آرتا با طرح لچک‌ترنج سنتی و حاشیه‌ی پرکار، ترکیبی از رنگ‌های طلایی، کرم و سرمه‌ای که گرمای یک خانه‌ی اصیل ایرانی را به فضای شما می‌آورد.',
    density: '۱۲۰۰ شانه، تراکم ۳۶۰۰',
    material: 'اکریلیک هیت‌ست شده',
  },
  {
    id: 2,
    slug: 'mahoor-modern',
    name: 'ماهور مدرن',
    categorySlug: 'modern',
    category: 'مدرن',
    designSlug: 'geometric',
    design: 'هندسی',
    materialSlug: 'polypropylene',
    size: '۲ × ۳',
    price: 6200000,
    originalPrice: null,
    tag: 'جدید',
    rating: 4.6,
    reviews: 88,
    image: '/carpets/modern-mahoor.png',
    description:
      'طرح هندسی مینیمال با پالت آبی دودی و کرم؛ ماهور برای فضاهای مدرن و امروزی طراحی شده و به سادگی با هر دکوراسیونی هماهنگ می‌شود.',
    density: '۱۰۰۰ شانه، تراکم ۳۰۰۰',
    material: 'پلی‌پروپیلن فریز',
  },
  {
    id: 3,
    slug: 'golestan-cream',
    name: 'گلستان کرم',
    categorySlug: 'classic',
    category: 'کلاسیک',
    designSlug: 'traditional',
    design: 'سنتی',
    materialSlug: 'acrylic',
    size: '۱.۲ × ۱.۸',
    price: 3100000,
    originalPrice: 3800000,
    tag: 'تخفیف ۱۸٪',
    rating: 4.7,
    reviews: 154,
    image: '/carpets/cream-golestan.png',
    description:
      'گلستان با زمینه‌ی روشن کرم و نقش‌های گل‌وبوته‌ی هم‌رنگ، حسی آرام و روشن به اتاق می‌بخشد؛ انتخابی ایده‌آل برای فضاهای کوچک و نورگیر.',
    density: '۱۲۰۰ شانه، تراکم ۳۶۰۰',
    material: 'اکریلیک هیت‌ست شده',
  },
  {
    id: 4,
    slug: 'negin-patine',
    name: 'نگین پتینه',
    categorySlug: 'patine',
    category: 'پتینه',
    designSlug: 'afshan',
    design: 'افشان',
    materialSlug: 'acrylic',
    size: '۳ × ۴',
    price: 12500000,
    originalPrice: null,
    tag: 'ویژه',
    rating: 4.9,
    reviews: 67,
    image: '/carpets/patine-negin.png',
    description:
      'افکت کهنه‌نمای پتینه با رنگ‌های خاکی و آجری گرم؛ نگین حال‌وهوایی نوستالژیک و لوکس را با دوام بالا ترکیب کرده است.',
    density: '۱۵۰۰ شانه، تراکم ۴۵۰۰',
    material: 'اکریلیک هیت‌ست شده',
  },
  {
    id: 5,
    slug: 'pardis-3d',
    name: 'پردیس سه‌بعدی',
    categorySlug: '3d',
    category: 'سه‌بعدی',
    designSlug: 'lachak-toranj',
    design: 'لچک ترنج',
    materialSlug: 'acrylic',
    size: '۲ × ۳',
    price: 7400000,
    originalPrice: 8200000,
    tag: 'تخفیف ۱۰٪',
    rating: 4.5,
    reviews: 41,
    image: '/carpets/3d-pardis.png',
    description:
      'بافت برجسته و افکت سه‌بعدی پردیس عمق بصری بی‌نظیری ایجاد می‌کند؛ ترنج طلایی در زمینه‌ی کرم، تلفیقی از سنت و تکنولوژی روز.',
    density: '۱۲۰۰ شانه، تراکم ۳۶۰۰',
    material: 'اکریلیک برجسته',
  },
  {
    id: 6,
    slug: 'shabnam-fantasy',
    name: 'شبنم فانتزی',
    categorySlug: 'fantasy',
    category: 'فانتزی',
    designSlug: 'modern',
    design: 'مدرن',
    materialSlug: 'polyester',
    size: '۱.۵ × ۲.۲۵',
    price: 4200000,
    originalPrice: null,
    tag: 'جدید',
    rating: 4.4,
    reviews: 29,
    image: '/carpets/fantasy-shabnam.png',
    description:
      'طرح فانتزی شبنم با رنگ‌های صورتی کم‌رنگ و طلایی، فضایی شاد و دل‌نشین برای اتاق کودک یا فضاهای دنج خلق می‌کند.',
    density: '۱۰۰۰ شانه، تراکم ۳۰۰۰',
    material: 'پلی‌استر نرم',
  },
  {
    id: 7,
    slug: 'saadi-plain',
    name: 'سعدی ساده‌بافت',
    categorySlug: 'plain',
    category: 'ساده‌بافت',
    designSlug: 'gabbeh',
    design: 'گبه',
    materialSlug: 'polypropylene',
    size: '۲ × ۳',
    price: 3900000,
    originalPrice: null,
    tag: null,
    rating: 4.6,
    reviews: 112,
    image: '/carpets/plain-saadi.png',
    description:
      'فرش ساده‌بافت سعدی با رنگ شنی گرم و حاشیه‌ی نازک؛ پایه‌ای آرام و خنثی که به سایر اجزای دکوراسیون اجازه‌ی دیده‌شدن می‌دهد.',
    density: '۷۰۰ شانه، تراکم ۲۱۰۰',
    material: 'پلی‌پروپیلن',
  },
  {
    id: 8,
    slug: 'darya-classic',
    name: 'دریا کلاسیک',
    categorySlug: 'classic',
    category: 'کلاسیک',
    designSlug: 'afshan',
    design: 'افشان',
    materialSlug: 'acrylic',
    size: '۳ × ۴',
    price: 13800000,
    originalPrice: 15200000,
    tag: 'پرفروش',
    rating: 4.9,
    reviews: 188,
    image: '/carpets/classic-darya.png',
    description:
      'زمینه‌ی سرمه‌ای عمیق با نقش‌های افشان طلایی؛ دریا یک فرش کلاسیک باشکوه برای پذیرایی‌های بزرگ و فضاهای رسمی است.',
    density: '۱۵۰۰ شانه، تراکم ۴۵۰۰',
    material: 'اکریلیک هیت‌ست شده',
  },
]

export const STATS = [
  { label: 'محصول', value: '۳۱۲+' },
  { label: 'مشتری راضی', value: '۱۸٬۰۰۰+' },
  { label: 'سال تجربه', value: '۱۵' },
  { label: 'ارسال به شهر', value: '۳۱' },
]

// ─── ابزار تبدیل عدد به فارسی ──────────────────────────────
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toFaNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
}

export function formatPrice(value: number): string {
  const withSeparators = value.toLocaleString('en-US').replace(/,/g, '٬')
  return toFaNumber(withSeparators)
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
