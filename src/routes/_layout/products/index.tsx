import { ProductsBrowser } from '@/feature/home/components/products-browser'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_layout/products/')({
  component: RouteComponent,
  validateSearch: z.object({
    cat: z.string().optional(),
  }),
  head: () => ({
    meta: [
      { title: 'محصولات | فرش مریم' },
      { name: 'description', content: 'مشاهده و خرید انواع فرش و قالی در فروشگاه فرش مریم' },
    ],
  }),
})

function RouteComponent() {
  const { cat } = Route.useSearch()
  return <ProductsBrowser initialCat={cat ?? 'all'} />
}
