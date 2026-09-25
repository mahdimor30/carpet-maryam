import { z } from 'zod'

export const CreateOrderSchema = z.object({
  shippingAddress: z.string().trim().min(10),
  shippingPostalCode: z.string().trim().min(5),
  shippingPhone: z.string().trim().min(10),
  notes: z.string().trim().optional(),
})

export type CreateOrderInput = z.input<typeof CreateOrderSchema>
