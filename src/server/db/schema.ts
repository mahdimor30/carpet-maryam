import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

/* ============================================================
 * 0. کاربران (Users) - admin / staff / customer در یک جدول
 *    پشتیبانی از دو روش لاگین: موبایل+پسورد و OTP
 * ============================================================ */

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  phone: text('phone').notNull().unique(), // شناسه‌ی اصلی لاگین (هم برای پسورد هم OTP)
  email: text('email').unique(), // اختیاری، بیشتر برای admin/staff کاربرد دارد

  name: text('name'),

  role: text('role', {
    enum: ['admin', 'staff', 'customer'],
  })
    .notNull()
    .default('customer'),

  // --- روش اول: لاگین با پسورد ---
  passwordHash: text('password_hash'), // اگر کاربر فقط با OTP لاگین می‌کند می‌تواند null باشد

  // --- روش دوم: لاگین با OTP ---
  otpCode: text('otp_code'),
  otpExpiresAt: text('otp_expires_at'),
  otpAttempts: integer('otp_attempts').notNull().default(0), // برای محدود کردن تلاش‌های اشتباه

  phoneVerifiedAt: text('phone_verified_at'), // اولین بار که شماره با OTP تایید شده

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),

  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})

/* نشست‌های فعال کاربر (برای مدیریت لاگین/توکن‌ها، خروج از همه‌ی دستگاه‌ها و غیره) */
export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  token: text('token').notNull().unique(), // هش‌شده ذخیره شود، نه خام
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),

  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

/* ============================================================
 * 1. جدول‌های محور مستقل (Lookup tables)
 *    دسته‌بندی، طرح، متریال - هرکدوم مستقل و many-to-many با محصول
 * ============================================================ */

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // مثلا: گبه، ماشینی، دستباف
  slug: text('slug').notNull().unique(), // برای URL: /category/gabbeh
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const designs = sqliteTable('designs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // مثلا: سنتی، مدرن، گبه
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const materials = sqliteTable('materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // مثلا: اکریلیک، نایلون، ابریشم
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

/* ============================================================
 * 2. محصول (Product) - والد مشترک
 *    اطلاعات کلی فرش که بین همه‌ی Variant ها مشترکه
 * ============================================================ */

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

/* جدول واسط محصول <-> دسته‌بندی (many-to-many) */
export const productCategories = sqliteTable(
  'product_categories',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
  }),
)

/* جدول واسط محصول <-> طرح (many-to-many) */
export const productDesigns = sqliteTable(
  'product_designs',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    designId: integer('design_id')
      .notNull()
      .references(() => designs.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.designId] }),
  }),
)

/* جدول واسط محصول <-> متریال (many-to-many) */
export const productMaterials = sqliteTable(
  'product_materials',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.materialId] }),
  }),
)

/* ============================================================
 * 3. Variant محصول
 *    هر ترکیب ابعاد + رنگ => موجودی و قیمت مستقل
 * ============================================================ */

export const productVariants = sqliteTable('product_variants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),

  dimension: text('dimension').notNull(), // مثلا: "6 متری", "9 متری", یا "200x300"
  color: text('color').notNull(), // مثلا: "کرم", "سرمه‌ای"
  colorHex: text('color_hex'), // اختیاری، برای نمایش سواچ رنگ در UI

  sku: text('sku').unique(), // کد محصول/شناسه انباری
  price: real('price').notNull(), // قیمت به تومان/ریال
  compareAtPrice: real('compare_at_price'), // قیمت قبل از تخفیف (اختیاری)
  stock: integer('stock').notNull().default(0), // موجودی انبار

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})

/* گالری عکس هر Variant - یک Variant چند عکس دارد */
export const variantImages = sqliteTable('variant_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  variantId: integer('variant_id')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt: text('alt'),
  sortOrder: integer('sort_order').notNull().default(0), // ترتیب نمایش در گالری
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

/* ============================================================
 * 4. سفارش واقعی (Order)
 *    از این پس هر سفارش الزاماً به یک کاربر لاگین‌شده (customer) وصل می‌شود
 * ============================================================ */

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),

  // آدرس و یادداشت همچنان مخصوص همین سفارش ذخیره می‌شود
  // (آدرس کاربر می‌تواند بین سفارش‌ها فرق کند)
  shippingAddress: text('shipping_address'),
  customerNote: text('customer_note'),

  totalAmount: real('total_amount').notNull(),
  status: text('status', {
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  })
    .notNull()
    .default('pending'),

  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  variantId: integer('variant_id')
    .notNull()
    .references(() => productVariants.id, { onDelete: 'restrict' }),

  quantity: integer('quantity').notNull().default(1),
  unitPrice: real('unit_price').notNull(), // قیمت لحظه‌ی خرید (snapshot، چون قیمت ممکنه بعداً تغییر کنه)
})

/* ============================================================
 * 5. استعلام قیمت (Inquiry)
 *    از این پس الزاماً به یک کاربر لاگین‌شده وصل می‌شود
 * ============================================================ */

export const inquiries = sqliteTable('inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  message: text('message'),

  productId: integer('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  variantId: integer('variant_id').references(() => productVariants.id, {
    onDelete: 'set null',
  }),

  status: text('status', {
    enum: ['new', 'contacted', 'closed'],
  })
    .notNull()
    .default('new'),

  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

/* ============================================================
 * 6. Relations - برای استفاده راحت‌تر با drizzle query API
 * ============================================================ */

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  orders: many(orders),
  inquiries: many(inquiries),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  categories: many(productCategories),
  designs: many(productDesigns),
  materials: many(productMaterials),
  inquiries: many(inquiries),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
}))

export const designsRelations = relations(designs, ({ many }) => ({
  products: many(productDesigns),
}))

export const materialsRelations = relations(materials, ({ many }) => ({
  products: many(productMaterials),
}))

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  }),
)

export const productDesignsRelations = relations(productDesigns, ({ one }) => ({
  product: one(products, {
    fields: [productDesigns.productId],
    references: [products.id],
  }),
  design: one(designs, {
    fields: [productDesigns.designId],
    references: [designs.id],
  }),
}))

export const productMaterialsRelations = relations(
  productMaterials,
  ({ one }) => ({
    product: one(products, {
      fields: [productMaterials.productId],
      references: [products.id],
    }),
    material: one(materials, {
      fields: [productMaterials.materialId],
      references: [materials.id],
    }),
  }),
)

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    images: many(variantImages),
    orderItems: many(orderItems),
  }),
)

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}))

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(users, {
    fields: [inquiries.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [inquiries.variantId],
    references: [productVariants.id],
  }),
}))
