import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CATEGORIES } from '@/lib/data'
import { CategoryPage } from '@/feature/home/components/category-page'

export const Route = createFileRoute('/_layout/categories/$slug')({
  component: RouteComponent,
  params: z.object({ slug: z.string() }),
  head: ({ params }) => {
    const category = CATEGORIES.find((item) => item.slug === params.slug)
    return {
      meta: [
        { title: `${category ? `فرش ${category.name}` : 'دسته‌بندی'} | فرش مریم` },
        { name: 'description', content: category ? `مشاهده و خرید مدل‌های فرش ${category.name}.` : 'دسته‌بندی محصولات فرش مریم' },
      ],
    }
  },
})

function RouteComponent() {
  const { slug } = Route.useParams()
  return <CategoryPage slug={slug} />
}
