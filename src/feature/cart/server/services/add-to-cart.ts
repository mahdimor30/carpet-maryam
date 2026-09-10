// src/features/cart/server/services/add-to-cart.ts

import {
  and,
  eq,
} from 'drizzle-orm'

import { getDb } from '@/server/db'

import {
  cartItems,
  carts,
  productVariants,
} from '@/server/db/schema'

export async function addToCart({
  userId,
  variantId,
  quantity,
}: {
  userId: number
  variantId: number
  quantity: number
}) {
  const db = getDb()

  // ----------------------------------------
  // Variant
  // ----------------------------------------

  const variant = await db
    .select({
      id: productVariants.id,
      stock: productVariants.stock,
      isActive: productVariants.isActive,
    })
    .from(productVariants)
    .where(
      and(
        eq(productVariants.id, variantId),
        eq(productVariants.isActive, true),
      ),
    )
    .limit(1)

  if (!variant[0]) {
    throw new Error(
      'Product variant not found',
    )
  }

  if (variant[0].stock <= 0) {
    throw new Error(
      'Product variant is out of stock',
    )
  }

  // ----------------------------------------
  // Cart
  // ----------------------------------------

  let cart = await db
    .select({
      id: carts.id,
    })
    .from(carts)
    .where(
      eq(carts.userId, userId),
    )
    .limit(1)

  let cartId: number

  if (!cart[0]) {
    const created = await db
      .insert(carts)
      .values({
        userId,
      })
      .returning({
        id: carts.id,
      })

    cartId = created[0].id
  } else {
    cartId = cart[0].id
  }

  // ----------------------------------------
  // Existing item
  // ----------------------------------------

  const existing = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cartId),
        eq(
          cartItems.variantId,
          variantId,
        ),
      ),
    )
    .limit(1)

  // ----------------------------------------
  // Update
  // ----------------------------------------

  if (existing[0]) {
    const newQuantity =
      existing[0].quantity + quantity

    if (
      newQuantity > variant[0].stock
    ) {
      throw new Error(
        `Only ${variant[0].stock} items available`,
      )
    }

    await db
      .update(cartItems)
      .set({
        quantity: newQuantity,
        updatedAt: new Date(),
      })
      .where(
        eq(
          cartItems.id,
          existing[0].id,
        ),
      )

    return {
      cartId,
      itemId: existing[0].id,
      quantity: newQuantity,
    }
  }

  // ----------------------------------------
  // Create
  // ----------------------------------------

  const created = await db
    .insert(cartItems)
    .values({
      cartId,
      variantId,
      quantity,
    })
    .returning({
      id: cartItems.id,
    })

  return {
    cartId,
    itemId: created[0].id,
    quantity,
  }
}