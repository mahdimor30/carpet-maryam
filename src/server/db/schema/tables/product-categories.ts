import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { categories } from './categories'
import { products } from './products'

export const productCategories = sqliteTable(
  'product_categories',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
      }),

    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.productId, table.categoryId],
    }),
  ],
)
