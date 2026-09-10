import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  token: text('token').notNull().unique(),

  userAgent: text('user_agent'),

  ipAddress: text('ip_address'),

  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),

  createdAt: integer('created_at', {
    mode: 'timestamp',
  })
    .notNull()
    .$defaultFn(() => new Date()),
})