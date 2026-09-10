import { eq } from 'drizzle-orm'

import { getDb } from '@/server/db'
import { cartItems, carts } from '@/server/db/schema'

export async function clearCart(userId: number) {
  const db = getDb()

  const cart = await db
    .select({
      id: carts.id,
    })
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1)

  if (!cart[0]) {
    return {
      success: true,
      deleted: 0,
    }
  }

  const items = await db
    .select({
      id: cartItems.id,
    })
    .from(cartItems)
    .where(eq(cartItems.cartId, cart[0].id))

  const deleted = items.length

  await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id))

  await db
    .update(carts)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(carts.id, cart[0].id))

  return {
    success: true,
    deleted,
  }
}
