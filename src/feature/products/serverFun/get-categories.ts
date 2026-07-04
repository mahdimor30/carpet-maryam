import { getDb } from '@/server/db'
import { createServerFn } from '@tanstack/react-start'

export const getCategories = createServerFn().handler(async () => {
  try {
    const db = getDb()

    const allCategories = await db.query.categories.findMany({})
    return allCategories
  } catch (error) {
    console.log(error)
    return []
  }
})
