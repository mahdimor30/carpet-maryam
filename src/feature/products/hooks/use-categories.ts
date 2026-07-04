import { queryOptions, useQuery } from '@tanstack/react-query'
import { getCategories } from '../serverFun/get-categories'

export const queryCategories = queryOptions({
  queryKey: ['categories'],
  queryFn: getCategories,
})

export const useCategories = () => useQuery(queryCategories)
