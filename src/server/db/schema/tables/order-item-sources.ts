import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { orderItems } from './order-items'
import { factories } from './factories'
import { factoryProducts } from './factory-products'

export const orderItemSources = sqliteTable('order_item_sources', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  orderItemId: integer('order_item_id')
    .notNull()
    .references(() => orderItems.id, {
      onDelete: 'cascade',
    }),

  sourceType: text('source_type', {
    enum: ['store', 'factory', 'weaving'],
  }).notNull(),
  factoryId: integer('factory_id')
    .references(() => factories.id, {
      onDelete: 'set null',
    }),

  factoryProductId: integer('factory_product_id')
    .references(() => factoryProducts.id, {
      onDelete: 'set null',
    }),

  purchasePrice: integer('purchase_price'),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),
})