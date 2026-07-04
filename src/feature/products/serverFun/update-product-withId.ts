import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import {
  products,
  productVariants,
  variantImages,
  productCategories,
  productDesigns,
  productMaterials,
} from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq, inArray } from 'drizzle-orm'
import { UpdateProductSchema } from './schemas'

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export const updateProductWithId = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(UpdateProductSchema)
  .handler(async ({ data }) => {
    const db = getDb()
    const { id, ...fields } = data
    const finalSlug = fields.slug ? slugify(fields.slug) : slugify(fields.name)

    try {
      // 1) به‌روزرسانی خود محصول
      await db
        .update(products)
        .set({
          name: fields.name,
          slug: finalSlug,
          description: fields.description,
          isActive: fields.isActive,
        })
        .where(eq(products.id, id))

      // 2) بازنویسی رابطه‌های many-to-many: حذف قدیمی و درج جدید
      await db.delete(productCategories).where(eq(productCategories.productId, id))
      if (fields.categoryIds.length > 0) {
        await db.insert(productCategories).values(
          fields.categoryIds.map((categoryId) => ({ productId: id, categoryId })),
        )
      }

      await db.delete(productDesigns).where(eq(productDesigns.productId, id))
      if (fields.designIds.length > 0) {
        await db.insert(productDesigns).values(
          fields.designIds.map((designId) => ({ productId: id, designId })),
        )
      }

      await db.delete(productMaterials).where(eq(productMaterials.productId, id))
      if (fields.materialIds.length > 0) {
        await db.insert(productMaterials).values(
          fields.materialIds.map((materialId) => ({ productId: id, materialId })),
        )
      }

      // 3) بازنویسی Variant‌ها: حذف قدیمی و درج جدید
      // Cascade روی productVariants خودکار variantImages را هم پاک می‌کند
      const oldVariants = await db
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.productId, id))

      if (oldVariants.length > 0) {
        const oldIds = oldVariants.map((v) => v.id)
        await db.delete(variantImages).where(inArray(variantImages.variantId, oldIds))
        await db.delete(productVariants).where(inArray(productVariants.id, oldIds))
      }

      for (const variant of fields.variants) {
        const [insertedVariant] = await db
          .insert(productVariants)
          .values({
            productId: id,
            dimension: variant.dimension,
            color: variant.color,
            colorHex: variant.colorHex,
            sku: variant.sku,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            stock: variant.stock,
            isActive: variant.isActive,
          })
          .returning({ id: productVariants.id })

        if (variant.images.length > 0) {
          await db.insert(variantImages).values(
            variant.images.map((image) => ({
              variantId: insertedVariant.id,
              url: image.url,
              alt: image.alt,
              sortOrder: image.sortOrder,
            })),
          )
        }
      }

      return { id }
    } catch (error) {
      console.log(error, '/updateProductError')
      return null
    }
  })
