import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { categories, designs, materials } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const TABLES = { category: categories, design: designs, material: materials } as const

export const deleteTaxonomy = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      type: z.enum(['category', 'design', 'material']),
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const db = getDb()
      const table = TABLES[data.type]

      await db.delete(table).where(eq(table.id, data.id))
      return { success: true }
    } catch (error) {
      console.log(error, '/deleteTaxonomyError')
      return { success: false }
    }
  })
