import { z } from 'zod'

export const ProductListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(24),

  search: z.string().trim().optional(),

  category: z.string().optional(),
  design: z.string().optional(),
  material: z.string().optional(),

  shaneh: z.coerce.number().int().positive().optional(),

  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),

  sort: z
    .enum(['newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
    .default('newest'),
})

export type ProductListInput = z.input<typeof ProductListSchema>

export type ProductListParams = z.output<typeof ProductListSchema>
