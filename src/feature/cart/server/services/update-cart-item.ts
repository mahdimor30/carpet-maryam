import { and, eq } from 'drizzle-orm'
import { getDb } from '@/server/db'
import { cartItems, carts, productVariants } from '@/server/db/schema'

export async function updateCartItem({
  userId,
  itemId,
  quantity,
}: {
  userId: number
  itemId: number
  quantity: number
}) {
  const db = getDb()

  const item = await db
    .select({
      itemId: cartItems.id,
      variantId: cartItems.variantId,
      cartId: cartItems.cartId,
    })
    .from(cartItems)
    .innerJoin(carts, eq(carts.id, cartItems.cartId))
    .where(and(eq(cartItems.id, itemId), eq(carts.userId, userId)))
    .limit(1)

  if (!item[0]) {
    throw new Error('Cart item not found')
  }

  const variant = await db
    .select({
      id: productVariants.id,
      stock: productVariants.stock,
      isActive: productVariants.isActive,
    })
    .from(productVariants)
    .where(
      and(
        eq(productVariants.id, item[0].variantId),
        eq(productVariants.isActive, true),
      ),
    )
    .limit(1)

  if (!variant[0]) {
    throw new Error('Product variant not found')
  }

  if (quantity > 20) {
    throw new Error('Maximum quantity is 20')
  }

  await db
    .update(cartItems)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(eq(cartItems.id, itemId))

  await db
    .update(carts)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(carts.id, item[0].cartId))

  return {
    itemId,
    quantity,
  }
}
