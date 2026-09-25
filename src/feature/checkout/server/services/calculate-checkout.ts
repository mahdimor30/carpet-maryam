import type { getVariantFactories } from '@/feature/products/server/queries/get-variant-factories'

type CheckoutItem = {
  itemId: number
  variantId: number
  quantity: number

  productName: string
  productSlug: string

  variantPrice: number
  variantSku: string

  directStockAvailable: boolean
  factoryAvailable: boolean

  factories: Awaited<ReturnType<typeof getVariantFactories>>
}

export async function calculateCheckout(items: CheckoutItem[]) {
  const calculatedItems = []

  for (const item of items) {
    const availableFactory = item.factories.find(
      (factory) => factory.availableQuantity >= item.quantity,
    )

    let source: {
      type: 'store' | 'factory' | 'weaving'
      factoryId: number | null
      factoryName: string | null
      purchasePrice: number | null
      factoryProductId?: number
    }

    if (item.directStockAvailable) {
      source = {
        type: 'store',
        factoryId: null,
        factoryName: null,
        purchasePrice: null,
      }
    } else if (availableFactory) {
      source = {
        type: 'factory',
        factoryId: availableFactory.factoryId,
        factoryProductId: availableFactory.factoryProductId,
        factoryName: availableFactory.factoryName,
        purchasePrice: availableFactory.purchasePrice,
      }
    } else {
      const weavingFactory = item.factories.find((factory) => factory.canWeave)

      if (!weavingFactory) {
        throw new Error(`Variant ${item.variantSku} is not available`)
      }

      source = {
        type: 'weaving',
        factoryId: weavingFactory.factoryId,
        factoryProductId: weavingFactory.factoryProductId,
        factoryName: weavingFactory.factoryName,
        purchasePrice: weavingFactory.purchasePrice,
      }
    }

    const totalPrice = item.variantPrice * item.quantity

    calculatedItems.push({
      ...item,
      source,
      totalPrice,
    })
  }

  const subtotal = calculatedItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  )

  const shipping = 0
  const discount = 0
  const total = subtotal + shipping - discount

  return {
    items: calculatedItems,
    subtotal,
    shipping,
    discount,
    total,
  }
}
