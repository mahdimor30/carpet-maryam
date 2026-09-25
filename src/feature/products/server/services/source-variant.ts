import { getVariantFactories } from '../queries/get-variant-factories'
import { selectBestFactory } from './select-best-factory'
import type { SourcingStrategy } from './select-best-factory'

export async function sourceVariant(
  variantId: number,
  strategy: SourcingStrategy = 'balanced',
) {
  const factories = await getVariantFactories(variantId)

  const normalizedFactories = factories.map((factory) => ({
    ...factory,
    quantity: factory.quantity ?? 0,
    reservedQuantity: factory.reservedQuantity ?? 0,
  }))

  const selectedFactory = selectBestFactory(normalizedFactories, strategy)

  if (!selectedFactory) {
    return {
      available: false,
      factory: null,
      alternatives: [],
    }
  }

  return {
    available: true,
    factory: selectedFactory,

    alternatives: normalizedFactories.filter(
      (factory) => factory.factoryId !== selectedFactory.factoryId,
    ),
  }
}
