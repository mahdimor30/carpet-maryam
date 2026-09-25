import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { materials } from './materials'
import { products } from './products'

export const productMaterials = sqliteTable(
  'product_materials',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
      }),

    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.productId, table.materialId],
    }),
  ],
)
