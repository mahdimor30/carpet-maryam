import { eq } from 'drizzle-orm'

import { getDb } from '@/server/db'
import {
  cartItems,
  carts,
  orderItemSources,
  orderItems,
  orders,
} from '@/server/db/schema'

import { getCheckout } from '@/feature/checkout/server/queries/get-checkout'

export async function createOrder({
  userId,
  shippingAddress,
  shippingPostalCode,
  shippingPhone,
  notes,
}: {
  userId: number
  shippingAddress: string
  shippingPostalCode: string
  shippingPhone: string
  notes?: string
}) {
  const db = getDb()

  // دوباره Checkout را محاسبه می‌کنیم
  const checkout = await getCheckout(userId)

  if (checkout.items.length === 0) {
    throw new Error('Cart is empty')
  }

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

  const statements = []

  // 1. Order
  const orderInsert = db
    .insert(orders)
    .values({
      userId,
      status: 'pending',
      totalAmount: checkout.total,
      shippingAddress: [shippingAddress, shippingPostalCode, shippingPhone]
        .filter(Boolean)
        .join(' | '),
      customerNote: notes ?? null,
    })
    .returning({
      id: orders.id,
    })

  statements.push(orderInsert)

  const [createdOrder] = await db.batch(statements as [typeof orderInsert])

  if (!createdOrder[0]) {
    throw new Error('Failed to create order')
  }

  const orderId = createdOrder[0].id

  // Order Items + Sources
  for (const item of checkout.items) {
    const createdItem = await db
      .insert(orderItems)
      .values({
        orderId,
        variantId: item.variantId,

        quantity: item.quantity,

        unitPrice: item.variantPrice,
        totalPrice: item.totalPrice,
      })
      .returning({
        id: orderItems.id,
      })

    if (!createdItem[0]) {
      throw new Error('Failed to create order item')
    }

    await db.insert(orderItemSources).values({
      orderItemId: createdItem[0].id,

      sourceType: item.source.type,

      factoryId: item.source.factoryId,

      factoryProductId: item.source.factoryProductId,

      purchasePrice: item.source.purchasePrice,
    })
  }

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id))

  await db
    .update(carts)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(carts.id, cart[0].id))

  return {
    orderId,
    subtotal: checkout.subtotal,
    shipping: checkout.shipping,
    discount: checkout.discount,
    total: checkout.total,
  }
}
