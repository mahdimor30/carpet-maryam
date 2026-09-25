import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './users'
import { products } from './products'
import { productVariants } from './product-variants'

export const inquiries = sqliteTable('inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  message: text('message').notNull(),

  productId: integer('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),

  variantId: integer('variant_id').references(() => productVariants.id, {
    onDelete: 'set null',
  }),

  status: text('status', {
    enum: ['new', 'contacted', 'closed'],
  })
    .notNull()
    .default('new'),

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
