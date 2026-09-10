// src/features/products/server/functions/get-variant-factories.ts

import { createServerFn } from '@tanstack/react-start'

import { getVariantFactories } from '../queries/get-variant-factories'

export const getVariantFactoriesFn = createServerFn({
  method: 'GET',
})
  .inputValidator((input: { variantId: number }) => {
    if (
      !Number.isInteger(input.variantId) ||
      input.variantId <= 0
    ) {
      throw new Error('Invalid variantId')
    }

    return input
  })
  .handler(async ({ data }) => {
    return getVariantFactories(data.variantId)
  })