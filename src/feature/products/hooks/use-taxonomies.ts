import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTaxonomies } from '../serverFun/get-taxonomies'
import { createTaxonomy } from '../serverFun/create-taxonomy'
import { deleteTaxonomy } from '../serverFun/delete-taxonomy'

export const queryTaxonomies = queryOptions({
  queryKey: ['taxonomies'],
  queryFn: getTaxonomies,
})

export const useTaxonomies = () => useQuery(queryTaxonomies)

export const useCreateTaxonomy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (value: { type: 'category' | 'design' | 'material'; name: string; slug: string }) =>
      createTaxonomy({ data: value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxonomies'] })
    },
  })
}

export const useDeleteTaxonomy = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (value: { type: 'category' | 'design' | 'material'; id: number }) =>
      deleteTaxonomy({ data: value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxonomies'] })
    },
  })
}
