import { ProductForm } from '@/feature/products/components/product-form'
import { queryProduct } from '@/feature/products/hooks/use-get-products-withId'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/_authed/dashboard/products/$id')({
  component: RouteComponent,
  params: z.object({
    id: z.string().transform(Number),
  }),
  async loader(ctx) {
    await ctx.context.queryClient.prefetchQuery(queryProduct(ctx.params.id))
  },
  head: () => ({
    meta: [
      { title: 'ویرایش محصول | فرش مریم' },
    ],
  }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <ProductForm productId={id} />
}
