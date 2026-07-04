import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getProductsWithId = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const product = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, Number(data.id)),
      with: {
        categories: true,
        designs: true,
        materials: true,
        variants: { with: { images: true } },
      },
    })

    return product
  })
