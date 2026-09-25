export type CheckoutSourceType = 'store' | 'factory' | 'weaving'

export type CheckoutSource = {
  type: CheckoutSourceType
  factoryId: number | null
  factoryName: string | null
  purchasePrice: number | null
}

export type CheckoutItem = {
  itemId: number
  variantId: number
  quantity: number

  productId: number
  productName: string
  productSlug: string

  variantPrice: number
  variantSku: string

  totalPrice: number

  source: CheckoutSource
}

export type CheckoutResult = {
  items: CheckoutItem[]

  subtotal: number
  shipping: number
  discount: number
  total: number
}
