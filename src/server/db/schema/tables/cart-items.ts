import {
  integer,
  sqliteTable,
  unique,
} from 'drizzle-orm/sqlite-core'

import { carts } from './carts'
import { productVariants } from './product-variants'

export const cartItems = sqliteTable(
  'cart_items',
  {
    id: integer('id')
      .primaryKey({ autoIncrement: true }),

    cartId: integer('cart_id')
      .notNull()
      .references(() => carts.id, {
        onDelete: 'cascade',
      }),

    variantId: integer('variant_id')
      .notNull()
      .references(() => productVariants.id, {
        onDelete: 'cascade',
      }),

    quantity: integer('quantity')
      .notNull()
      .default(1),

    createdAt: integer('created_at', {
      mode: 'timestamp',
    })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer('updated_at', {
      mode: 'timestamp',
    })
      .notNull()
      .$defaultFn(() => new Date()),
  },

  (table) => [
    unique(
      'cart_item_cart_variant_unique',
    ).on(
      table.cartId,
      table.variantId,
    ),
  ],
)