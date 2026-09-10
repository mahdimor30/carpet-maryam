// src/features/products/server/functions/get-product-by-slug.ts

import { createServerFn } from '@tanstack/react-start'

import { getProductBySlug } from '../queries/get-product-by-slug'

export const getProductBySlugFn = createServerFn({
  method: 'GET',
})
  .inputValidator((input: { slug: string }) => {
    if (!input.slug?.trim()) {
      throw new Error('Product slug is required')
    }

    return {
      slug: input.slug.trim(),
    }
  })
  .handler(async ({ data }) => {
    return getProductBySlug(data.slug)
  })