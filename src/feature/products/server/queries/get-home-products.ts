// src/features/products/server/queries/get-home-products.ts

import { and, desc, eq, sql } from 'drizzle-orm'

import { getDb } from '@/server/db'

import { products } from '@/server/db/schema'

/**
 * شکلی که صفحه اصلی از محصولات مصرف می‌کند.
 * همه مقادیر از دیتابیس می‌آیند.
 */
export type HomeProduct = {
  id: number
  slug: string
  name: string
  description: string | null
  brand: string | null

  image: string | null

  price: number
  compareAtPrice: number | null
  discountPercent: number | null

  size: string | null
  shaneh: number | null
  density: number | null
  yarn: string | null
  warrantyMonths: number | null

  stock: number
  variantCount: number

  category: { name: string; slug: string } | null
  design: { name: string; slug: string } | null
  material: { name: string; slug: string } | null
}

// ─────────────────────────────────────────────
// قطعات SQL
// ─────────────────────────────────────────────
//
// این زیرکوئری‌ها عمداً به‌صورت SQL خام نوشته شده‌اند: هنگام درج یک ستون
// در فهرست SELECT، Drizzle نام جدول را حذف می‌کند و ارجاع‌هایی مثل
// "id" = "variant_id" در JOIN مبهم می‌شوند. نام‌های صریح جدول از این
// ابهام و از تطبیق اشتباه ستون با جدول داخلی جلوگیری می‌کنند.

// فقط محصولاتی که تنوع فعال دارند قابل نمایش هستند.
const hasActiveVariant = sql`EXISTS (
  SELECT 1
  FROM product_variants
  WHERE product_variants.product_id = products.id
    AND product_variants.is_active = 1
)`

// ارزان‌ترین تنوع، مرجع نمایش قیمت در کارت محصول است.
const cheapestVariantPrice = sql<number | null>`(
  SELECT MIN(product_variants.price)
  FROM product_variants
  WHERE product_variants.product_id = products.id
    AND product_variants.is_active = 1
)`

const cheapestVariantCompareAtPrice = sql<number | null>`(
  SELECT product_variants.compare_at_price
  FROM product_variants
  WHERE product_variants.product_id = products.id
    AND product_variants.is_active = 1
  ORDER BY product_variants.price ASC, product_variants.id ASC
  LIMIT 1
)`

const cheapestVariantDimension = sql<string | null>`(
  SELECT product_variants.dimension
  FROM product_variants
  WHERE product_variants.product_id = products.id
    AND product_variants.is_active = 1
  ORDER BY product_variants.price ASC, product_variants.id ASC
  LIMIT 1
)`

const totalStock = sql<number | null>`(
  SELECT COALESCE(SUM(product_variants.stock), 0)
  FROM product_variants
  WHERE product_variants.product_id = products.id
    AND product_variants.is_active = 1
)`

const activeVariantCount = sql<number | null>`(
  SELECT COUNT(*)
  FROM product_variants
  WHERE product_variants.product_id = products.id
    AND product_variants.is_active = 1
)`

// تصویر اصلی از میان تنوع‌های فعال انتخاب می‌شود.
const primaryImage = sql<string | null>`(
  SELECT vi.url
  FROM variant_images AS vi
  INNER JOIN product_variants AS pv
    ON pv.id = vi.variant_id
  WHERE pv.product_id = products.id
    AND pv.is_active = 1
  ORDER BY vi.is_primary DESC, vi.sort_order ASC, vi.id ASC
  LIMIT 1
)`

const firstCategoryName = sql<string | null>`(
  SELECT c.name
  FROM product_categories AS pc
  INNER JOIN categories AS c
    ON c.id = pc.category_id
  WHERE pc.product_id = products.id
  ORDER BY c.id ASC
  LIMIT 1
)`

const firstCategorySlug = sql<string | null>`(
  SELECT c.slug
  FROM product_categories AS pc
  INNER JOIN categories AS c
    ON c.id = pc.category_id
  WHERE pc.product_id = products.id
  ORDER BY c.id ASC
  LIMIT 1
)`

const firstDesignName = sql<string | null>`(
  SELECT d.name
  FROM product_designs AS pd
  INNER JOIN designs AS d
    ON d.id = pd.design_id
  WHERE pd.product_id = products.id
  ORDER BY d.id ASC
  LIMIT 1
)`

const firstDesignSlug = sql<string | null>`(
  SELECT d.slug
  FROM product_designs AS pd
  INNER JOIN designs AS d
    ON d.id = pd.design_id
  WHERE pd.product_id = products.id
  ORDER BY d.id ASC
  LIMIT 1
)`

const firstMaterialName = sql<string | null>`(
  SELECT m.name
  FROM product_materials AS pm
  INNER JOIN materials AS m
    ON m.id = pm.material_id
  WHERE pm.product_id = products.id
  ORDER BY m.id ASC
  LIMIT 1
)`

const firstMaterialSlug = sql<string | null>`(
  SELECT m.slug
  FROM product_materials AS pm
  INNER JOIN materials AS m
    ON m.id = pm.material_id
  WHERE pm.product_id = products.id
  ORDER BY m.id ASC
  LIMIT 1
)`

// ─────────────────────────────────────────────
// نگاشت ردیف دیتابیس به شکل مصرفی صفحه اصلی
// ─────────────────────────────────────────────

type HomeProductRow = {
  id: number
  slug: string
  name: string
  description: string | null
  brand: string | null
  shaneh: number | null
  density: number | null
  yarn: string | null
  warrantyMonths: number | null
  price: number | null
  compareAtPrice: number | null
  size: string | null
  image: string | null
  stock: number | null
  variantCount: number | null
  categoryName: string | null
  categorySlug: string | null
  designName: string | null
  designSlug: string | null
  materialName: string | null
  materialSlug: string | null
}

function toHomeProduct(row: HomeProductRow): HomeProduct {
  const price = row.price ?? 0

  // تنها تخفیف واقعی نمایش داده می‌شود.
  const compareAtPrice =
    row.compareAtPrice != null && row.compareAtPrice > price
      ? row.compareAtPrice
      : null

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    brand: row.brand,

    image: row.image,

    price,
    compareAtPrice,
    discountPercent: compareAtPrice
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null,

    size: row.size,
    shaneh: row.shaneh,
    density: row.density,
    yarn: row.yarn,
    warrantyMonths: row.warrantyMonths,

    stock: row.stock ?? 0,
    variantCount: row.variantCount ?? 0,

    category:
      row.categoryName && row.categorySlug
        ? { name: row.categoryName, slug: row.categorySlug }
        : null,
    design:
      row.designName && row.designSlug
        ? { name: row.designName, slug: row.designSlug }
        : null,
    material:
      row.materialName && row.materialSlug
        ? { name: row.materialName, slug: row.materialSlug }
        : null,
  }
}

async function fetchHomeProducts({
  limit,
  discountedFirst,
}: {
  limit: number
  discountedFirst: boolean
}) {
  const db = getDb()

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.descriptionShort,
      brand: products.brand,

      shaneh: products.shaneh,
      density: products.density,
      yarn: products.yarn,
      warrantyMonths: products.warrantyMonths,

      price: cheapestVariantPrice,
      compareAtPrice: cheapestVariantCompareAtPrice,
      size: cheapestVariantDimension,

      image: primaryImage,

      stock: totalStock,
      variantCount: activeVariantCount,

      categoryName: firstCategoryName,
      categorySlug: firstCategorySlug,
      designName: firstDesignName,
      designSlug: firstDesignSlug,
      materialName: firstMaterialName,
      materialSlug: firstMaterialSlug,
    })
    .from(products)
    .where(and(eq(products.isActive, true), hasActiveVariant))
    .orderBy(
      ...(discountedFirst
        ? [
            sql`CASE
              WHEN ${cheapestVariantCompareAtPrice} > ${cheapestVariantPrice}
              THEN 0
              ELSE 1
            END`,
          ]
        : []),
      desc(products.createdAt),
      desc(products.id),
    )
    .limit(limit)

  return rows.map(toHomeProduct)
}

/**
 * محصولات منتخب صفحه اصلی؛ محصولات دارای تخفیف اولویت دارند.
 */
export function getFeaturedProducts(limit = 4) {
  return fetchHomeProducts({ limit, discountedFirst: true })
}

/**
 * گالری الهام‌بخش صفحه اصلی؛ آخرین محصولات ثبت‌شده.
 */
export function getGalleryProducts(limit = 6) {
  return fetchHomeProducts({ limit, discountedFirst: false })
}
