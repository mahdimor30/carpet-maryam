import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { products } from './products'

export const productVariants = sqliteTable('product_variants', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  productId: integer('product_id')
    .notNull()
    .references(() => products.id, {
      onDelete: 'cascade',
    }),

  // مثال: 2x3، 3x4، 6 متری، 9 متری
  dimension: text('dimension').notNull(),

  // نام رنگ
  color: text('color').notNull(),

  // HEX برای نمایش رنگ در UI
  colorHex: text('color_hex'),

  // شناسه یکتا برای انبار / سفارش / کارخانه
  sku: text('sku').notNull().unique(),

  // قیمت فروش به تومان
  price: integer('price').notNull(),

  // قیمت قبل از تخفیف
  compareAtPrice: integer('compare_at_price'),

  // Legacy:
  // موجودی واقعی از factory_inventory مدیریت خواهد شد.
  stock: integer('stock').notNull().default(0),

  isActive: integer('is_active', {
    mode: 'boolean',
  })
    .notNull()
    .default(true),

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
