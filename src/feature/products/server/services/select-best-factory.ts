import type { FactoryAvailability } from '../types'

export type SourcingStrategy = 'lowest_price' | 'fastest' | 'balanced'

export function selectBestFactory(
  factories: FactoryAvailability[],
  strategy: SourcingStrategy = 'balanced',
) {
  const available = factories.filter(
    (factory) => factory.availableQuantity > 0 || factory.canWeave,
  )

  if (available.length === 0) {
    return null
  }

  const sorted = [...available].sort((a, b) => {
    switch (strategy) {
      case 'lowest_price':
        return (a.purchasePrice ?? Infinity) - (b.purchasePrice ?? Infinity)

      case 'fastest':
        return (a.weavingDays ?? Infinity) - (b.weavingDays ?? Infinity)

      case 'balanced': {
        const aPrice = a.purchasePrice ?? Infinity
        const bPrice = b.purchasePrice ?? Infinity

        const aDays = a.weavingDays ?? Infinity
        const bDays = b.weavingDays ?? Infinity

        // اولویت با موجودی آماده
        const aInStock = a.availableQuantity > 0
        const bInStock = b.availableQuantity > 0

        if (aInStock !== bInStock) {
          return aInStock ? -1 : 1
        }

        // سپس قیمت
        if (aPrice !== bPrice) {
          return aPrice - bPrice
        }

        // سپس زمان تولید
        return aDays - bDays
      }
    }
  })

  return sorted[0]
}
