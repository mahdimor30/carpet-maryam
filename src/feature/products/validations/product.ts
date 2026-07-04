import { faToEn } from '@/lib/dashboard-data'
import { z } from 'zod'

export const variantImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  sortOrder: z.number(),
})

export const variantSchema = z.object({
  id: z.string(),
  dimension: z.string().min(1, 'ابعاد الزامی است.'),
  color: z.string().min(1, 'رنگ الزامی است.'),
  colorHex: z.string(),
  sku: z.string(),
  price: z
    .string()
    .min(1, 'قیمت الزامی است.')
    .refine((v) => Number(faToEn(v)) > 0, 'قیمت باید بیشتر از صفر باشد.'),
  compareAtPrice: z.string(),
  stock: z.string(),
  isActive: z.boolean(),
  images: z.array(variantImageSchema),
})

export const productSchema = z.object({
  name: z.string().min(1, 'نام محصول را وارد کنید.'),
  slug: z.string().min(1, 'نامک (slug) محصول را وارد کنید.'),
  description: z.string(),
  isActive: z.boolean(),
  categoryIds: z.array(z.number()).min(1, 'حداقل یک دسته‌بندی انتخاب کنید.'),
  designIds: z.array(z.number()),
  materialIds: z.array(z.number()),
  variants: z.array(variantSchema).min(1, 'حداقل یک تنوع لازم است.'),
})

export type VariantFormValues = z.infer<typeof variantSchema>
export type ProductFormValues = z.infer<typeof productSchema>