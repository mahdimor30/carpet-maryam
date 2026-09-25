import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  phone: text('phone').notNull().unique(),

  email: text('email').unique(),

  name: text('name'),

  role: text('role', {
    enum: ['admin', 'staff', 'customer'],
  })
    .notNull()
    .default('customer'),

  passwordHash: text('password_hash'),

  // OTP authentication
  otpCode: text('otp_code'),
  otpExpiresAt: integer('otp_expires_at', { mode: 'timestamp' }),
  otpAttempts: integer('otp_attempts').notNull().default(0),

  phoneVerifiedAt: integer('phone_verified_at', {
    mode: 'timestamp',
  }),

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
