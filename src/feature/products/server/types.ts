export type FactoryAvailability = {
  factoryId: number
  factoryName: string
  factorySlug: string

  canWeave: boolean
  weavingDays: number | null

  quantity: number
  reservedQuantity: number
  availableQuantity: number

  purchasePrice: number | null
  quoteUpdatedAt: Date | null
}