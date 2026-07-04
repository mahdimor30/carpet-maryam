import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { createServerFn } from '@tanstack/react-start'

export const getTaxonomies = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => {
    try {
      const db = getDb()
      const [categories, designs, materials] = await Promise.all([
        db.query.categories.findMany({}),
        db.query.designs.findMany({}),
        db.query.materials.findMany({}),
      ])
      return { categories, designs, materials }
    } catch (error) {
      console.log(error)
      return { categories: [], designs: [], materials: [] }
    }
  })
