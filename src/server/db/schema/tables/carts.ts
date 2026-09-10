import {
  integer,
  sqliteTable,
  text,
  unique
} from 'drizzle-orm/sqlite-core'

import { users } from './users'

export const carts = sqliteTable('carts', {
  id: integer('id')
    .primaryKey({ autoIncrement: true }),

  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  sessionId: text('session_id'),

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
},(table) => [
  unique('carts_user_unique').on(table.userId),
  unique('carts_session_unique').on(table.sessionId),
])