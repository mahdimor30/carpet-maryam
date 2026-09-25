import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { productVariants } from './product-variants'

export const variantImages = sqliteTable('variant_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  variantId: integer('variant_id')
    .notNull()
    .references(() => productVariants.id, {
      onDelete: 'cascade',
    }),

  // UploadThing URL
  url: text('url').notNull(),

  // در صورت نیاز برای مدیریت فایل در UploadThing
  key: text('key'),

  alt: text('alt'),

  type: text('type', {
    enum: ['main', 'gallery', 'texture', 'room'],
  })
    .notNull()
    .default('gallery'),

  sortOrder: integer('sort_order').notNull().default(0),

  isPrimary: integer('is_primary', {
    mode: 'boolean',
  })
    .notNull()
    .default(false),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),
})
