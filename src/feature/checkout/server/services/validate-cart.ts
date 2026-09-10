import { and, eq } from 'drizzle-orm'

import { getDb } from '@/server/db'
import {
  cartItems,
  carts,
  products,
  productVariants,
} from '@/server/db/schema'

import { getVariantFactories } from '@/feature/products/server/queries/get-variant-factories'

export async function validateCart(userId: number) {
  const db = getDb()

  const cart = await db
    .select({
      id: carts.id,
    })
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1)

  if (!cart[0]) {
    throw new Error('Cart not found')
  }

  const items = await db
    .select({
      itemId: cartItems.id,
      variantId: cartItems.variantId,
      quantity: cartItems.quantity,

      productId: products.id,
      productName: products.name,
      productSlug: products.slug,

      variantPrice: productVariants.price,
      variantSku: productVariants.sku,
      variantStock: productVariants.stock,
    })
    .from(cartItems)
    .innerJoin(
      productVariants,
      eq(productVariants.id, cartItems.variantId),
    )
    .innerJoin(
      products,
      eq(products.id, productVariants.productId),
    )
    .where(
      and(
        eq(cartItems.cartId, cart[0].id),
        eq(productVariants.isActive, true),
        eq(products.isActive, true),
      ),
    )

  if (items.length === 0) {
    throw new Error('Cart is empty')
  }

  const validatedItems = []

  for (const item of items) {
    const factories = await getVariantFactories(item.variantId)

    const directStockAvailable =
      item.variantStock >= item.quantity

    const factoryAvailable = factories.some(
      (factory) =>
        factory.availableQuantity >= item.quantity ||
        factory.canWeave,
    )

    if (!directStockAvailable && !factoryAvailable) {
      throw new Error(
        `Variant ${item.variantSku} is no longer available`,
      )
    }

    validatedItems.push({
      ...item,
      directStockAvailable,
      factoryAvailable,
      factories,
    })
  }

  return {
    cartId: cart[0].id,
    items: validatedItems,
  }
}