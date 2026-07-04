import { authMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { categories, designs, materials } from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const TABLES = { category: categories, design: designs, material: materials } as const

export const createTaxonomy = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      type: z.enum(['category', 'design', 'material']),
      name: z.string().min(2),
      slug: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const db = getDb()
      const table = TABLES[data.type]

      const [inserted] = await db
        .insert(table)
        .values({ name: data.name, slug: data.slug })
        .returning({ id: table.id, name: table.name, slug: table.slug })

      return inserted
    } catch (error) {
      console.log(error, '/createTaxonomyError')
      return null
    }
  })
