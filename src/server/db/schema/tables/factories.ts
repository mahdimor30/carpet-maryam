import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const factories = sqliteTable('factories', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),

  slug: text('slug').notNull().unique(),

  phone: text('phone'),

  whatsapp: text('whatsapp'),

  contactName: text('contact_name'),

  address: text('address'),

  city: text('city'),

  region: text('region'),

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
})
