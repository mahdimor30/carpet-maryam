import { createFileRoute } from '@tanstack/react-router'
import { CategoriesPage } from '@/feature/home/components/categories-page'

export const Route = createFileRoute('/_layout/categories/')({
  component: CategoriesPage,
  loader: () => {
    console.log('log')
  },
  head: () => ({
    meta: [
      { title: 'دسته‌بندی فرش‌ها | فرش مریم' },
      {
        name: 'description',
        content:
          'مشاهده انواع دسته‌بندی فرش کلاسیک، مدرن، پتینه، ساده‌بافت، سه‌بعدی و فانتزی.',
      },
    ],
  }),
})
