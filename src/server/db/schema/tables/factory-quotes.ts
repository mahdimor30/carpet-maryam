import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { factoryProducts } from './factory-products'
import { users } from './users'

export const factoryQuotes = sqliteTable('factory_quotes', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  factoryProductId: integer('factory_product_id')
    .notNull()
    .references(() => factoryProducts.id, {
      onDelete: 'cascade',
    }),

  // قیمت خرید از کارخانه به تومان
  purchasePrice: integer('purchase_price').notNull(),

  // شروع اعتبار قیمت
  validFrom: integer('valid_from', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),

  // پایان اعتبار قیمت
  validUntil: integer('valid_until', {
    mode: 'timestamp',
  }),

  // کاربری که قیمت را ثبت کرده
  quotedByUserId: integer('quoted_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),

  notes: text('notes'),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),
})
