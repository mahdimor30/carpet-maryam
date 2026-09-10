import { createServerFn } from '@tanstack/react-start'
import { RemoveCartItemSchema } from '../../schemas'
import { removeCartItem } from '../services/remove-cart-item'

export const removeCartItemFn = createServerFn({
  method: 'POST',
})
  .inputValidator((input) => {
    return RemoveCartItemSchema.parse(input)
  })
  .handler(async ({ data }) => {
    // فعلاً userId را موقتاً از auth می‌گیریم
    const userId = 1

    return removeCartItem({
      userId,
      itemId: data.itemId,
    })
  })