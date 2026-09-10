// src/features/cart/server/queries/get-cart.ts

import { eq } from 'drizzle-orm'

import { getDb } from '@/server/db'

import {
  cartItems,
  carts,
} from '@/server/db/schema'

export async function getCart(
  userId: number,
) {
  const db = getDb()

  const cart = await db
    .select({
      id: carts.id,
      userId: carts.userId,
      createdAt: carts.createdAt,
      updatedAt: carts.updatedAt,
    })
    .from(carts)
    .where(
      eq(carts.userId, userId),
    )
    .limit(1)

  if (!cart[0]) {
    return null
  }

  const items = await db
    .select({
      id: cartItems.id,
      variantId: cartItems.variantId,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .where(
      eq(cartItems.cartId, cart[0].id),
    )

  return {
    ...cart[0],
    items,
  }
}