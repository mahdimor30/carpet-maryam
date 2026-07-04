import { queryOptions, useQuery } from '@tanstack/react-query'
import { getProducts } from '../serverFun/get-products'

export const queryPrpducts = queryOptions({
  queryKey: ['products'],
  queryFn: getProducts,
})

export const useProducts = () => {
 return useQuery(queryPrpducts)
}
