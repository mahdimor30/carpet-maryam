import { and, eq, gte, sql } from 'drizzle-orm'

import { getDb } from '@/server/db'
import { factoryInventory } from '@/server/db/schema'

export function reserveFactoryInventoryQuery({
  factoryProductId,
  quantity,
}: {
  factoryProductId: number
  quantity: number
}) {
  const db = getDb()

  return db
    .update(factoryInventory)
    .set({
      reservedQuantity: sql`
        ${factoryInventory.reservedQuantity} + ${quantity}
      `,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(factoryInventory.factoryProductId, factoryProductId),
        gte(
          sql`
            ${factoryInventory.quantity} -
            ${factoryInventory.reservedQuantity}
          `,
          quantity,
        ),
      ),
    )
}
