import { z } from 'zod'

export const AddToCartSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().max(20),
})

export const UpdateCartItemSchema = z.object({
  itemId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().max(20),
})

export const RemoveCartItemSchema = z.object({
  itemId: z.coerce.number().int().positive(),
})

export type RemoveCartItemInput = z.input<typeof RemoveCartItemSchema>

export type AddToCartInput = z.input<typeof AddToCartSchema>
export type UpdateCartItemInput = z.input<typeof UpdateCartItemSchema>
