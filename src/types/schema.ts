import type { BuildQueryResult, ExtractTablesWithRelations } from 'drizzle-orm'
import * as schema from '@/server/db/schema'

type Schema = ExtractTablesWithRelations<typeof schema>

export type ProductWithCategories = BuildQueryResult<
  Schema,
  Schema['products'],
  {
    with: {
      categories: true
      designs: true
      materials: true
      variants: { with: { images: true } }
    }
  }
>
