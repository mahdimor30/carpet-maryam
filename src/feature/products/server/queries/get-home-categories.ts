// src/features/products/server/queries/get-home-categories.ts

import { desc, sql } from 'drizzle-orm'

import { getDb } from '@/server/db'

import { categories } from '@/server/db/schema'

export type HomeCategory = {
  id: number
  name: string
  slug: string
  image: string | null
  productCount: number
}

// زیرکوئری‌ها به‌صورت SQL خام نوشته شده‌اند تا نام جدول‌ها صریح و بدون
// ابهام رندر شود (Drizzle در فهرست SELECT پیشوند جدول را حذف می‌کند).

// تعداد محصولات فعال هر دسته
const productCount = sql<number>`(
  SELECT COUNT(*)
  FROM product_categories AS pc
  INNER JOIN products AS p
    ON p.id = pc.product_id
  WHERE pc.category_id = categories.id
    AND p.is_active = 1
)`

// اگر برای خود دسته تصویری ثبت نشده باشد، از تصویر یکی از محصولاتش استفاده می‌شود.
const fallbackImage = sql<string | null>`(
  SELECT vi.url
  FROM product_categories AS pc
  INNER JOIN products AS p
    ON p.id = pc.product_id
  INNER JOIN product_variants AS pv
    ON pv.product_id = p.id
  INNER JOIN variant_images AS vi
    ON vi.variant_id = pv.id
  WHERE pc.category_id = categories.id
    AND p.is_active = 1
    AND pv.is_active = 1
  ORDER BY vi.is_primary DESC, vi.sort_order ASC, vi.id ASC
  LIMIT 1
)`

const categoryImage = sql<
  string | null
>`COALESCE(categories.image, ${fallbackImage})`

export async function getHomeCategories(limit = 6) {
  const db = getDb()

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      image: categoryImage,
      productCount,
    })
    .from(categories)
    .orderBy(desc(productCount), categories.id)
    .limit(limit)

  return rows.map<HomeCategory>((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image,
    productCount: Number(row.productCount ?? 0),
  }))
}
