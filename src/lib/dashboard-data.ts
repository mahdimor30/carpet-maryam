// ─── داده‌ها و انواع داشبورد مدیریت فرش مریم ───────────────
// (مطابق با اسکیمای دیتابیس - فعلاً سمت کلاینت و بدون بک‌اند)

export type Lookup = {
  id: number
  name: string
  slug: string
}

// دسته‌بندی‌ها (categories)
export const DASH_CATEGORIES: Lookup[] = [
  { id: 1, name: 'کلاسیک', slug: 'classic' },
  { id: 2, name: 'مدرن', slug: 'modern' },
  { id: 3, name: 'ساده‌بافت', slug: 'plain' },
  { id: 4, name: 'پتینه', slug: 'patine' },
  { id: 5, name: 'سه‌بعدی', slug: '3d' },
  { id: 6, name: 'فانتزی', slug: 'fantasy' },
]

// طرح‌ها (designs)
export const DASH_DESIGNS: Lookup[] = [
  { id: 1, name: 'سنتی', slug: 'traditional' },
  { id: 2, name: 'مدرن', slug: 'modern' },
  { id: 3, name: 'گبه', slug: 'gabbeh' },
  { id: 4, name: 'افشان', slug: 'afshan' },
  { id: 5, name: 'لچک ترنج', slug: 'lachak-toranj' },
  { id: 6, name: 'هندسی', slug: 'geometric' },
]

// متریال‌ها (materials)
export const DASH_MATERIALS: Lookup[] = [
  { id: 1, name: 'اکریلیک', slug: 'acrylic' },
  { id: 2, name: 'نایلون', slug: 'nylon' },
  { id: 3, name: 'ابریشم', slug: 'silk' },
  { id: 4, name: 'پلی‌پروپیلن', slug: 'polypropylene' },
  { id: 5, name: 'پلی‌استر', slug: 'polyester' },
  { id: 6, name: 'پشم', slug: 'wool' },
]

// سواچ‌های رنگ پیشنهادی برای Variant ها
export const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'کرم', hex: '#e8dcc0' },
  { name: 'سرمه‌ای', hex: '#1f2a44' },
  { name: 'طلایی', hex: '#c9a227' },
  { name: 'آجری', hex: '#a8472f' },
  { name: 'شنی', hex: '#cdbb9a' },
  { name: 'دودی', hex: '#6b7280' },
  { name: 'زرشکی', hex: '#7a1f2b' },
  { name: 'فیلی', hex: '#8a8d91' },
]

// ابعاد رایج فرش
export const DIMENSION_PRESETS = [
  '۱ متری',
  '۱.۵ متری',
  '۶ متری',
  '۹ متری',
  '۱۲ متری',
  '۱۵۰×۲۲۵',
  '۲۰۰×۳۰۰',
  '۳۰۰×۴۰۰',
]

// ─── انواع فرم ─────────────────────────────────────────────
export type VariantImageInput = {
  id: string
  url: string
  alt: string
  sortOrder: number
}

export type VariantInput = {
  id: string
  dimension: string
  color: string
  colorHex: string
  sku: string
  price: string
  compareAtPrice: string
  stock: string
  isActive: boolean
  images: VariantImageInput[]
}

export type ProductFormState = {
  name: string
  slug: string
  description: string
  isActive: boolean
  categoryIds: number[]
  designIds: number[]
  materialIds: number[]
  variants: VariantInput[]
}

// ─── ابزارها ───────────────────────────────────────────────
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
}

export function faToEn(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
}

export function formatToman(value: number): string {
  const sep = value.toLocaleString('en-US').replace(/,/g, '٬')
  return toFa(sep)
}

// تولید slug از نام فارسی/انگلیسی
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

let variantCounter = 0
export function makeEmptyVariant(): VariantInput {
  variantCounter += 1
  return {
    id: `v-${Date.now()}-${variantCounter}`,
    dimension: '',
    color: '',
    colorHex: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    stock: '0',
    isActive: true,
    images: [],
  }
}

export function makeEmptyImage(sortOrder: number): VariantImageInput {
  variantCounter += 1
  return {
    id: `img-${Date.now()}-${variantCounter}`,
    url: '',
    alt: '',
    sortOrder,
  }
}

export function toServerVariant(v: VariantInput) {
  return {
    dimension: v.dimension,
    color: v.color,
    colorHex: v.colorHex || undefined,
    sku: v.sku || undefined,
    price: Number(faToEn(v.price)),
    compareAtPrice: v.compareAtPrice ? Number(faToEn(v.compareAtPrice)) : undefined,
    stock: Number(faToEn(v.stock)) || 0,
    isActive: v.isActive,
    images: v.images.map((img) => ({
      url: img.url,
      alt: img.alt || undefined,
      sortOrder: img.sortOrder,
    })),
  }
}

export function makeInitialForm(): ProductFormState {
  return {
    name: '',
    slug: '',
    description: '',
    isActive: true,
    categoryIds: [],
    designIds: [],
    materialIds: [],
    variants: [makeEmptyVariant()],
  }
}

// ─── محصولات نمونه برای فهرست داشبورد ──────────────────────
export type DashProductRow = {
  id: number
  name: string
  slug: string
  categories: string[]
  variants: number
  minPrice: number
  totalStock: number
  isActive: boolean
  createdAt: string
}

export const DASH_PRODUCTS: DashProductRow[] = [
  {
    id: 1,
    name: 'آرتا ۱۲۰۰ شانه',
    slug: 'arta-1200',
    categories: ['کلاسیک'],
    variants: 4,
    minPrice: 4800000,
    totalStock: 36,
    isActive: true,
    createdAt: '۱۴۰۳/۰۵/۱۲',
  },
  {
    id: 2,
    name: 'ماهور مدرن',
    slug: 'mahoor-modern',
    categories: ['مدرن'],
    variants: 3,
    minPrice: 6200000,
    totalStock: 18,
    isActive: true,
    createdAt: '۱۴۰۳/۰۶/۰۲',
  },
  {
    id: 3,
    name: 'نگین پتینه',
    slug: 'negin-patine',
    categories: ['پتینه'],
    variants: 2,
    minPrice: 12500000,
    totalStock: 7,
    isActive: false,
    createdAt: '۱۴۰۳/۰۶/۲۰',
  },
  {
    id: 4,
    name: 'گلستان کرم',
    slug: 'golestan-cream',
    categories: ['کلاسیک', 'ساده‌بافت'],
    variants: 5,
    minPrice: 3100000,
    totalStock: 52,
    isActive: true,
    createdAt: '۱۴۰۳/۰۷/۰۸',
  },
]
