// src/features/products/server/queries/get-variant-factories.ts

import { and, eq, sql } from 'drizzle-orm'

import { getDb } from '@/server/db'

import {
  factories,
  factoryInventory,
  factoryProducts,
  factoryQuotes,
  productVariants,
} from '@/server/db/schema'

export async function getVariantFactories(variantId: number) {
  const db = getDb()

  const rows = await db
    .select({
      factoryProductId: factoryProducts.id,

      factoryId: factories.id,
      factoryName: factories.name,
      factorySlug: factories.slug,

      canWeave: factoryProducts.canWeave,
      weavingDays: factoryProducts.weavingDays,

      quantity: sql<number>`COALESCE(${factoryInventory.quantity}, 0)`,
      reservedQuantity: sql<number>`COALESCE(${factoryInventory.reservedQuantity}, 0)`,

      availableQuantity: sql<number>`
        MAX(
          0,
          ${factoryInventory.quantity}
          - ${factoryInventory.reservedQuantity}
        )
      `,

      purchasePrice: factoryQuotes.purchasePrice,

      quoteUpdatedAt: factoryQuotes.createdAt,
    })
    .from(factoryProducts)

    .innerJoin(factories, eq(factories.id, factoryProducts.factoryId))

    .innerJoin(
      productVariants,
      eq(productVariants.id, factoryProducts.variantId),
    )

    .leftJoin(
      factoryInventory,
      eq(factoryInventory.factoryProductId, factoryProducts.id),
    )

    .leftJoin(
      factoryQuotes,
      and(eq(factoryQuotes.factoryProductId, factoryProducts.id)),
    )

    .where(
      and(
        eq(factoryProducts.variantId, variantId),

        eq(factoryProducts.isActive, true),

        eq(factories.isActive, true),

        eq(productVariants.isActive, true),

        sql`
          (
            ${factoryProducts.canWeave} = 1
            OR
            COALESCE(
              ${factoryInventory.quantity},
              0
            ) -
            COALESCE(
              ${factoryInventory.reservedQuantity},
              0
            ) > 0
          )
        `,
      ),
    )
    .orderBy(
      sql`
        CASE
          WHEN
            COALESCE(
              ${factoryInventory.quantity},
              0
            ) -
            COALESCE(
              ${factoryInventory.reservedQuantity},
              0
            ) > 0
          THEN 0
          ELSE 1
        END
      `,
      sql`
        COALESCE(
          ${factoryQuotes.purchasePrice},
          999999999999
        ) ASC
      `,
    )

  return rows
}
