import { db } from '@/db'

export async function getProducts() {
  return db.query.productsTable.findMany({
    with: {
      category: true,
    },
  })
}
