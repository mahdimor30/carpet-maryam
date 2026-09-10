import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const materials = sqliteTable('materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),

  slug: text('slug').notNull().unique(),

  image: text('image'),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),
})