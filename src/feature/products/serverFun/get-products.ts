import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { createServerFn } from '@tanstack/react-start'

export const getProducts = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => {
    try {
      const db = getDb()
      const allProducts = await db.query.products.findMany({
        with: {
          categories: { with: { category: true } },
          designs: { with: { design: true } },
          materials: { with: { material: true } },
          variants: true,
        },
      })

      return allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        categories: p.categories.map((pc) => pc.category.name),
        designs: p.designs.map((pd) => pd.design.name),
        materials: p.materials.map((pm) => pm.material.name),
        variants: p.variants.length,
        minPrice:
          p.variants.length > 0
            ? Math.min(...p.variants.map((v) => v.price))
            : 0,
        totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      }))
    } catch (error) {
      console.log(error)
      return []
    }
  })
