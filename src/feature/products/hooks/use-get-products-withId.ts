import { queryOptions, useQuery } from '@tanstack/react-query'
import { getProductsWithId } from '../serverFun/get-products-withId'

export const queryProduct = (id: number) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: async () =>
      await getProductsWithId({
        data: {
          id,
        },
      }),
    enabled: Number.isFinite(id),
  })

export const useProductWithId = (id?: number) =>
  useQuery(queryProduct(id as number))