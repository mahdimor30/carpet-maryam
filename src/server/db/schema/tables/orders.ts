import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'restrict',
    }),

  // اطلاعات ارسال در زمان ثبت سفارش ذخیره می‌شود
  shippingAddress: text('shipping_address').notNull(),

  customerNote: text('customer_note'),

  // مجموع مبلغ سفارش به تومان
  totalAmount: integer('total_amount').notNull().default(0),

  status: text('status', {
    enum: [
      'pending',
      'confirmed',
      'sourcing',
      'quality_check',
      'shipped',
      'delivered',
      'cancelled',
    ],
  })
    .notNull()
    .default('pending'),

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
})