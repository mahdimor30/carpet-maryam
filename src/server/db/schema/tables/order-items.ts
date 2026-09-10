import { integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { orders } from './orders'
import { productVariants } from './product-variants'

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),

  variantId: integer('variant_id')
    .notNull()
    .references(() => productVariants.id, {
      onDelete: 'restrict',
    }),

  quantity: integer('quantity').notNull().default(1),

  // قیمت واحد در لحظه ثبت سفارش
  unitPrice: integer('unit_price').notNull(),

  // مبلغ کل این آیتم
  totalPrice: integer('total_price').notNull(),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),
})