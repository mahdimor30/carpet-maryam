import { z } from 'zod'

export const serverVariantImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional().default(0),
})

export const serverVariantSchema = z.object({
  dimension: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
  images: z.array(serverVariantImageSchema).optional().default([]),
})

export const NewProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  categoryIds: z.array(z.number().int().positive()).optional().default([]),
  designIds: z.array(z.number().int().positive()).optional().default([]),
  materialIds: z.array(z.number().int().positive()).optional().default([]),
  variants: z.array(serverVariantSchema).optional().default([]),
})

export const UpdateProductSchema = NewProductSchema.extend({
  id: z.number(),
})

export type NewProductInput = z.infer<typeof NewProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
