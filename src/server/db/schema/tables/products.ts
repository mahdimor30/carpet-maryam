import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),

  slug: text('slug').notNull().unique(),

  description: text('description'),

  descriptionShort: text('description_short'),

  // برند فرش؛ با کارخانه متفاوت است
  brand: text('brand'),

  // سبک فرش
  style: text('style', {
    enum: ['classic', 'traditional', 'modern', 'minimal', 'children', 'fancy'],
  }),

  // مشخصات فنی
  shaneh: integer('shaneh'),

  density: integer('density'),

  yarn: text('yarn'),

  pileHeightMm: integer('pile_height_mm'),

  weightPerSquareMeterGrams: integer('weight_per_square_meter_grams'),

  weavingType: text('weaving_type'),

  warrantyMonths: integer('warranty_months'),

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
