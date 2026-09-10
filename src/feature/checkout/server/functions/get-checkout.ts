import { createServerFn } from '@tanstack/react-start'

import { getCheckout } from '@/feature/checkout/server/queries/get-checkout'

export const getCheckoutFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  // TODO: از session/auth خودت بگیریم
  const userId = 1

  return getCheckout(userId)
})