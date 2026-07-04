import { createFileRoute } from '@tanstack/react-router'

import HomePage from '@/feature/home'

export const Route = createFileRoute('/_layout/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'فرش مریم | فروشگاه تخصصی فرش و قالی' },
    ],
  }),
})


