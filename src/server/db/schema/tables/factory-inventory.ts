import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { factoryProducts } from './factory-products'

export const factoryInventory = sqliteTable(
  'factory_inventory',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    factoryProductId: integer('factory_product_id')
      .notNull()
      .references(() => factoryProducts.id, {
        onDelete: 'cascade',
      }),

    // تعداد موجودی اعلام‌شده توسط کارخانه
    quantity: integer('quantity').notNull().default(0),

    // مقداری که برای سفارش‌ها رزرو شده
    reservedQuantity: integer('reserved_quantity').notNull().default(0),

    // آخرین زمان بررسی موجودی
    checkedAt: integer('checked_at', {
      mode: 'timestamp',
    }),

    notes: text('notes'),

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
    unique('factory_inventory_factory_product_unique').on(
      table.factoryProductId,
    ),
  ],
)