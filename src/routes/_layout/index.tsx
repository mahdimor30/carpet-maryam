import { createFileRoute } from '@tanstack/react-router'

import HomePage from '@/feature/home'
import { getHomeProductsFn } from '@/feature/products/server/functions/get-home-products'
import { createSeo } from '@/lib/seo'

export const Route = createFileRoute('/_layout/')({
  component: HomeRoute,

  loader: () => {
    return getHomeProductsFn()
  },

  head: () =>
    createSeo({
      title: 'فرش مریم | خرید فرش ماشینی و دستباف',
      description:
        'فرش مریم؛ فروشگاه تخصصی فرش ماشینی و دستباف با تنوع بالا، قیمت مناسب و مشاوره تخصصی برای انتخاب فرش مناسب خانه شما.',
      path: '/',
    }),
})

function HomeRoute() {
  const { featured, gallery, categories } = Route.useLoaderData()

  return (
    <HomePage
      featuredProducts={featured}
      galleryProducts={gallery}
      categories={categories}
    />
  )
}
