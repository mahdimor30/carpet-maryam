import { getVariantFactories } from '../queries/get-variant-factories'
import {
  selectBestFactory,
  type SourcingStrategy,
} from './select-best-factory'

export async function sourceVariant(
  variantId: number,
  strategy: SourcingStrategy = 'balanced',
) {
  const factories =
    await getVariantFactories(variantId)

  const selectedFactory =
    selectBestFactory(
      factories,
      strategy,
    )

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

    alternatives: factories.filter(
      (factory) =>
        factory.factoryId !==
        selectedFactory.factoryId,
    ),
  }
}