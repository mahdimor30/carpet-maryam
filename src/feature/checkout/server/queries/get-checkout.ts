import { validateCart } from '@/feature/checkout/server/services/validate-cart'
import { calculateCheckout } from '@/feature/checkout/server/services/calculate-checkout'

export async function getCheckout(userId: number) {
  const validatedCart = await validateCart(userId)

  return calculateCheckout(validatedCart.items)
}
