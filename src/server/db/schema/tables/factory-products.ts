import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { factories } from './factories'
import { productVariants } from './product-variants'

export const factoryProducts = sqliteTable(
  'factory_products',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    factoryId: integer('factory_id')
      .notNull()
      .references(() => factories.id, {
        onDelete: 'cascade',
      }),

    variantId: integer('variant_id')
      .notNull()
      .references(() => productVariants.id, {
        onDelete: 'cascade',
      }),

    // آیا کارخانه امکان بافت این Variant را دارد؟
    canWeave: integer('can_weave', {
      mode: 'boolean',
    })
      .notNull()
      .default(false),

    // مدت تقریبی بافت به روز
    weavingDays: integer('weaving_days'),

    notes: text('notes'),

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
  },
  (table) => [
    unique('factory_product_factory_variant_unique').on(
      table.factoryId,
      table.variantId,
    ),
  ],
)
