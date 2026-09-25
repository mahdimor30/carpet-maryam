import { createServerFn } from '@tanstack/react-start'
import { clearCart } from '../services/clear-cart'

export const clearCartFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  const userId = 1

  return clearCart(userId)
})
