import { and, eq, gte, sql } from 'drizzle-orm'

import { getDb } from '@/server/db'
import {
  factoryInventory,
  factoryProducts,
} from '@/server/db/schema'

export async function reserveFactoryInventory({
  factoryProductId,
  quantity,
}: {
  factoryProductId: number
  quantity: number
}) {
  if (quantity <= 0) {
    throw new Error('Invalid quantity')
  }

  const db = getDb()

  const result = await db
    .update(factoryInventory)
    .set({
      reservedQuantity: sql`
        ${factoryInventory.reservedQuantity} + ${quantity}
      `,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(
          factoryInventory.factoryProductId,
          factoryProductId,
        ),
        gte(
          sql`
            ${factoryInventory.quantity} -
            ${factoryInventory.reservedQuantity}
          `,
          quantity,
        ),
      ),
    )
    .run()

  if (!result.meta.changes) {
    throw new Error(
      'Not enough factory inventory available',
    )
  }

  return {
    success: true,
    factoryProductId,
    quantity,
  }
}