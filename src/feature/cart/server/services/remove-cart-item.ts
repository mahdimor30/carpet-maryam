import { and, eq } from 'drizzle-orm'
import { getDb } from '@/server/db'
import { cartItems, carts } from '@/server/db/schema'

export async function removeCartItem({
  userId,
  itemId,
}: {
  userId: number
  itemId: number
}) {
  const db = getDb()

  const item = await db
    .select({
      itemId: cartItems.id,
      cartId: cartItems.cartId,
    })
    .from(cartItems)
    .innerJoin(carts, eq(carts.id, cartItems.cartId))
    .where(
      and(
        eq(cartItems.id, itemId),
        eq(carts.userId, userId),
      ),
    )
    .limit(1)

  if (!item[0]) {
    throw new Error('Cart item not found')
  }

  await db
    .delete(cartItems)
    .where(eq(cartItems.id, itemId))

  await db
    .update(carts)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(carts.id, item[0].cartId))

  return {
    success: true,
    itemId,
  }
}