import { useMutation } from '@tanstack/react-query'
import { updateProductWithId } from '../serverFun/update-product-withId'
import { toServerVariant } from '@/lib/dashboard-data'
import type { ProductFormValues } from '../validations/product'

export const useUpdateProduct = () =>
  useMutation({
    mutationFn: async ({ id, ...value }: ProductFormValues & { id: number }) => {
      const serverValue = {
        id,
        ...value,
        variants: value.variants?.map(toServerVariant),
      }
      return await updateProductWithId({ data: serverValue })
    },
  })
