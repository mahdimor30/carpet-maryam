import { db } from '@/db'
import { productsTable } from '@/server/db/schema'

import { createProductSchema } from '../validations/product'
import type z from 'zod'

type Input = z.infer<typeof createProductSchema>

export async function createProduct(input: Input) {
  const validated = createProductSchema.parse(input)

  const [product] = await db.insert(productsTable).values(validated).returning()

  return product
}
