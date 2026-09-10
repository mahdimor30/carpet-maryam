import { createServerFn } from '@tanstack/react-start'

import { CreateOrderSchema } from '@/feature/checkout/schemas'

import { createOrder } from '@/feature/checkout/server/services/create-order'

export const createOrderFn = createServerFn({
  method: 'POST',
})
  .inputValidator((input) => {
    return CreateOrderSchema.parse(input)
  })
  .handler(async ({ data }) => {
    // TODO: بعداً از auth/session
    const userId = 1

    return createOrder({
      userId,
      shippingAddress: data.shippingAddress,
      shippingPostalCode: data.shippingPostalCode,
      shippingPhone: data.shippingPhone,
      notes: data.notes,
    })
  })