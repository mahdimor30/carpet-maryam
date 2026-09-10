// src/features/products/server/functions/get-products.ts

import { createServerFn } from '@tanstack/react-start'

import {
  ProductListSchema,
  type ProductListInput,
} from '../schemas'

import { getProducts } from '../queries/get-products'

export const getProductsFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (input: ProductListInput) =>
      ProductListSchema.parse(input),
  )
  .handler(async ({ data }) => {
    return getProducts(data)
  })