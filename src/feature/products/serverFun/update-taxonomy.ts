import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { categories, designs, materials } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const TABLES = { category: categories, design: designs, material: materials } as const

export const updateTaxonomy = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      type: z.enum(['category', 'design', 'material']),
      id: z.number(),
      name: z.string().min(2),
      slug: z.string().min(1),
      image: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const db = getDb()
      const table = TABLES[data.type]
      const [updated] = await db
        .update(table)
        .set({ name: data.name, slug: data.slug, ...(data.image !== undefined ? { image: data.image } : {}) })
        .where(eq(table.id, data.id))
        .returning({ id: table.id, name: table.name, slug: table.slug, image: table.image })
      return updated
    } catch (error) {
      console.log(error, '/updateTaxonomyError')
      return null
    }
  })
