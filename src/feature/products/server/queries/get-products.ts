import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm'

import { getDb } from '@/server/db'

import {
  categories,
  designs,
  materials,
  productCategories,
  productDesigns,
  productMaterials,
  productVariants,
  products,
} from '@/server/db/schema'

import { ProductListSchema } from '../schemas'
import type { ProductListInput } from '../schemas'

export async function getProducts(input: ProductListInput = {}) {
  const params = ProductListSchema.parse(input)

  const {
    page,
    limit,
    search,
    category,
    design,
    material,
    shaneh,
    minPrice,
    maxPrice,
    sort,
  } = params

  const db = getDb()

  const offset = (page - 1) * limit

  const conditions = [eq(products.isActive, true)]

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  if (search) {
    conditions.push(
      or(
        like(products.name, `%${search}%`),
        like(products.description, `%${search}%`),
        like(products.brand, `%${search}%`),
      )!,
    )
  }

  // --------------------------------------------------
  // Shaneh
  // --------------------------------------------------

  if (shaneh) {
    conditions.push(eq(products.shaneh, shaneh))
  }

  // --------------------------------------------------
  // Category
  // --------------------------------------------------

  if (category) {
    conditions.push(
      sql`EXISTS (
        SELECT 1
        FROM ${productCategories}
        INNER JOIN ${categories}
          ON ${categories.id} = ${productCategories.categoryId}
        WHERE ${productCategories.productId} = ${products.id}
          AND ${categories.slug} = ${category}
      )`,
    )
  }

  // --------------------------------------------------
  // Design
  // --------------------------------------------------

  if (design) {
    conditions.push(
      sql`EXISTS (
        SELECT 1
        FROM ${productDesigns}
        INNER JOIN ${designs}
          ON ${designs.id} = ${productDesigns.designId}
        WHERE ${productDesigns.productId} = ${products.id}
          AND ${designs.slug} = ${design}
      )`,
    )
  }

  // --------------------------------------------------
  // Material
  // --------------------------------------------------

  if (material) {
    conditions.push(
      sql`EXISTS (
        SELECT 1
        FROM ${productMaterials}
        INNER JOIN ${materials}
          ON ${materials.id} = ${productMaterials.materialId}
        WHERE ${productMaterials.productId} = ${products.id}
          AND ${materials.slug} = ${material}
      )`,
    )
  }

  // --------------------------------------------------
  // Price
  // --------------------------------------------------
  // Price belongs to variants, not products.

  if (minPrice !== undefined) {
    conditions.push(
      sql`EXISTS (
        SELECT 1
        FROM ${productVariants}
        WHERE ${productVariants.productId} = ${products.id}
          AND ${productVariants.price} >= ${minPrice}
      )`,
    )
  }

  if (maxPrice !== undefined) {
    conditions.push(
      sql`EXISTS (
        SELECT 1
        FROM ${productVariants}
        WHERE ${productVariants.productId} = ${products.id}
          AND ${productVariants.price} <= ${maxPrice}
      )`,
    )
  }

  const where = and(...conditions)

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------

  const orderBy = (() => {
    switch (sort) {
      case 'price_asc':
        return asc(
          sql`(
            SELECT MIN(${productVariants.price})
            FROM ${productVariants}
            WHERE ${productVariants.productId} = ${products.id}
          )`,
        )

      case 'price_desc':
        return desc(
          sql`(
            SELECT MIN(${productVariants.price})
            FROM ${productVariants}
            WHERE ${productVariants.productId} = ${products.id}
          )`,
        )

      case 'name_asc':
        return asc(products.name)

      case 'name_desc':
        return desc(products.name)

      case 'newest':
      default:
        return desc(products.createdAt)
    }
  })()

  // --------------------------------------------------
  // Total
  // --------------------------------------------------

  const [{ count }] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(where)

  // --------------------------------------------------
  // Products
  // --------------------------------------------------

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      descriptionShort: products.descriptionShort,
      brand: products.brand,
      style: products.style,
      shaneh: products.shaneh,
      density: products.density,
      yarn: products.yarn,
      pileHeightMm: products.pileHeightMm,
      weightPerSquareMeterGrams: products.weightPerSquareMeterGrams,
      weavingType: products.weavingType,
      warrantyMonths: products.warrantyMonths,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,

      minPrice: sql<number | null>`
        MIN(${productVariants.price})
      `,

      maxPrice: sql<number | null>`
        MAX(${productVariants.price})
      `,

      variantCount: sql<number>`
        COUNT(DISTINCT ${productVariants.id})
      `,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .where(where)
    .groupBy(products.id)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  const total = Number(count)

  return {
    items: rows,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  }
}
