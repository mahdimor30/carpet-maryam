import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { designs } from './designs'
import { products } from './products'

export const productDesigns = sqliteTable(
  'product_designs',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
      }),

    designId: integer('design_id')
      .notNull()
      .references(() => designs.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.productId, table.designId],
    }),
  ],
)