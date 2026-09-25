import { queryOptions, useQuery } from '@tanstack/react-query'
import { getCurrentUserFn } from '../serverFn/get-user-cuemt'

const authQueryOptions = queryOptions({
  queryFn: async () => await getCurrentUserFn(),
  queryKey: ['user'],
})

export default function useAuth() {
  return useQuery(authQueryOptions)
}
