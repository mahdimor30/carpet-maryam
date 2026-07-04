import { ProductForm } from '@/feature/products/components/product-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard/products/new/')({
  component: NewProductPage,
  head: () => ({
    meta: [
      { title: 'محصول جدید | فرش مریم' },
    ],
  }),
})

function NewProductPage() {
  return <ProductForm />
}
