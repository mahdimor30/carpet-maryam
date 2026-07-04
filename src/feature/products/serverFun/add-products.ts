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
import { eq } from 'drizzle-orm'
import { NewProductSchema } from './schemas'

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export const addProductsServerFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(NewProductSchema)
  .handler(async ({ data }) => {
    const db = getDb()
    const finalSlug = data.slug ? slugify(data.slug) : slugify(data.name)

    let productId: number | undefined

    try {
      // 1) خود محصول
      const [insertedProduct] = await db
        .insert(products)
        .values({
          name: data.name,
          slug: finalSlug,
          description: data.description,
          isActive: data.isActive,
        })
        .returning({ id: products.id })

      productId = insertedProduct.id

      // 2) رابطه‌های many-to-many
      if (data.categoryIds.length > 0) {
        await db.insert(productCategories).values(
          data.categoryIds.map((categoryId) => ({
            productId: productId!,
            categoryId,
          })),
        )
      }

      if (data.designIds.length > 0) {
        await db.insert(productDesigns).values(
          data.designIds.map((designId) => ({
            productId: productId!,
            designId,
          })),
        )
      }

      if (data.materialIds.length > 0) {
        await db.insert(productMaterials).values(
          data.materialIds.map((materialId) => ({
            productId: productId!,
            materialId,
          })),
        )
      }

      // 3) Variant ها + گالری عکس هر کدام
      for (const variant of data.variants) {
        const [insertedVariant] = await db
          .insert(productVariants)
          .values({
            productId: productId!,
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

      return { id: productId }
    } catch (error) {
      console.log(error, '/productErrror')

      // cleanup دستی: اگر محصول ساخته شده بود ولی مرحله بعدی خطا داد، حذفش کن
      // به لطف onDelete: 'cascade' روی همه‌ی جداول وابسته، همه‌چیز پاک میشه
      if (productId) {
        try {
          await db.delete(products).where(eq(products.id, productId))
        } catch (cleanupError) {
          console.log(cleanupError, '/cleanupError')
        }
      }

      return null
    }
  })