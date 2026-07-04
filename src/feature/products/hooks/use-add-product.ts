import { useMutation } from '@tanstack/react-query'
import { addProductsServerFn } from '../serverFun/add-products'
import { toServerVariant } from '@/lib/dashboard-data'
import type { ProductFormValues } from '../validations/product'

export const useAddProduct = () =>
  useMutation({
    mutationFn: async (value: ProductFormValues) => {
      const serverValue = {
        ...value,
        variants: value.variants?.map(toServerVariant),
      }
      return await addProductsServerFn({ data: serverValue })
    },
  })
