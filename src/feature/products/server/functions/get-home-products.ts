// src/features/products/server/functions/get-home-products.ts

import { createServerFn } from '@tanstack/react-start'

import { getHomeCategories } from '../queries/get-home-categories'
import {
  getFeaturedProducts,
  getGalleryProducts,
} from '../queries/get-home-products'

/**
 * تمام داده‌ی محصولی صفحه اصلی در یک رفت‌وبرگشت.
 */
export const getHomeProductsFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const [featured, gallery, categories] = await Promise.all([
    getFeaturedProducts(4),
    getGalleryProducts(6),
    getHomeCategories(6),
  ])

  return { featured, gallery, categories }
})
