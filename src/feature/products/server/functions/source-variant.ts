// src/features/products/server/functions/source-variant.ts

import { createServerFn } from '@tanstack/react-start'

import { sourceVariant } from '../services/source-variant'

export const sourceVariantFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (input: {
      variantId: number
      strategy?:
        | 'lowest_price'
        | 'fastest'
        | 'balanced'
    }) => {
      if (
        !Number.isInteger(input.variantId) ||
        input.variantId <= 0
      ) {
        throw new Error('Invalid variantId')
      }

      return {
        variantId: input.variantId,
        strategy: input.strategy ?? 'balanced',
      }
    },
  )
  .handler(async ({ data }) => {
    return sourceVariant(
      data.variantId,
      data.strategy,
    )
  })