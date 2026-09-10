import { and, asc, eq, sql } from 'drizzle-orm'

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
  variantImages,
} from '@/server/db/schema'

export async function getProductBySlug(slug: string) {
  const db = getDb()

  // ----------------------------------------
  // Product
  // ----------------------------------------

  const product = await db
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
      weightPerSquareMeterGrams:
        products.weightPerSquareMeterGrams,

      weavingType: products.weavingType,
      warrantyMonths: products.warrantyMonths,

      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(
      and(
        eq(products.slug, slug),
        eq(products.isActive, true),
      ),
    )
    .limit(1)

  if (!product[0]) {
    return null
  }

  const productId = product[0].id

  // ----------------------------------------
  // Variants
  // ----------------------------------------

  const variants = await db
    .select({
      id: productVariants.id,
      dimension: productVariants.dimension,
      color: productVariants.color,
      colorHex: productVariants.colorHex,

      sku: productVariants.sku,

      price: productVariants.price,
      compareAtPrice:
        productVariants.compareAtPrice,

      stock: productVariants.stock,

      isActive: productVariants.isActive,

      images: sql<
        Array<{
          id: number
          url: string
          key: string | null
          alt: string | null
          type: string
          sortOrder: number
          isPrimary: boolean
        }>
      >`
        COALESCE(
          (
            SELECT json_group_array(
              json_object(
                'id', ${variantImages.id},
                'url', ${variantImages.url},
                'key', ${variantImages.key},
                'alt', ${variantImages.alt},
                'type', ${variantImages.type},
                'sortOrder', ${variantImages.sortOrder},
                'isPrimary', ${variantImages.isPrimary}
              )
            )
            FROM ${variantImages}
            WHERE ${variantImages.variantId} = ${productVariants.id}
          ),
          '[]'
        )
      `,
    })
    .from(productVariants)
    .where(
      and(
        eq(productVariants.productId, productId),
        eq(productVariants.isActive, true),
      ),
    )
    .orderBy(
      asc(productVariants.price),
      asc(productVariants.dimension),
    )

  // ----------------------------------------
  // Categories
  // ----------------------------------------

  const productCategoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(productCategories)
    .innerJoin(
      categories,
      eq(
        categories.id,
        productCategories.categoryId,
      ),
    )
    .where(
      eq(productCategories.productId, productId),
    )

  // ----------------------------------------
  // Designs
  // ----------------------------------------

  const productDesignRows = await db
    .select({
      id: designs.id,
      name: designs.name,
      slug: designs.slug,
    })
    .from(productDesigns)
    .innerJoin(
      designs,
      eq(
        designs.id,
        productDesigns.designId,
      ),
    )
    .where(
      eq(productDesigns.productId, productId),
    )

  // ----------------------------------------
  // Materials
  // ----------------------------------------

  const productMaterialRows = await db
    .select({
      id: materials.id,
      name: materials.name,
      slug: materials.slug,
    })
    .from(productMaterials)
    .innerJoin(
      materials,
      eq(
        materials.id,
        productMaterials.materialId,
      ),
    )
    .where(
      eq(productMaterials.productId, productId),
    )

  return {
    ...product[0],

    categories: productCategoryRows,
    designs: productDesignRows,
    materials: productMaterialRows,

    variants,
  }
}