import { ProductDetail } from '@/feature/home/components/product-detail'
import { getProduct } from '@/lib/data'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_layout/products/$slug')({
  component: RouteComponent,
  params: z.object({
    slug: z.string(),
  }),
  head: ({ params }) => {
    const product = getProduct(params.slug)
    const name = product?.name ?? 'محصول'
    const desc = product?.description ?? 'جزئیات محصول'
    return {
      meta: [
        { title: `${name} | فرش مریم` },
        { name: 'description', content: desc },
      ],
    }
  },
})

function RouteComponent() {
  const { slug } = Route.useParams()
  return <ProductDetail slug={slug} />
}
