import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  PlusCircle,
  Layers,
  Info,
  Tags,
  Check,
  Loader2,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  DASH_CATEGORIES,
  DASH_DESIGNS,
  DASH_MATERIALS,
  faToEn,
  makeEmptyVariant,
  slugify,
  toFa,
  type VariantInput,
} from '@/lib/dashboard-data'
import { ChipSelect, Field, TextArea, TextInput, Toggle } from './form-controls'
import { VariantEditor } from './variant-editor'

import type { ProductWithCategories } from '@/types/schema'
import { useProductWithId } from '../hooks/use-get-products-withId'
import { useAddProduct } from '../hooks/use-add-product'
import { useUpdateProduct } from '../hooks/use-update-product'
import { productSchema, type ProductFormValues } from '../validations/product'
import SectionCard from './section-card'
import HeaderPage from '@/components/header-page'

function toFormVariant(
  v: NonNullable<NonNullable<ProductWithCategories['variants']>[number]>,
): VariantInput {
  return {
    id: String(v.id),
    dimension: v.dimension,
    color: v.color,
    colorHex: v.colorHex ?? '',
    sku: v.sku ?? '',
    price: String(v.price),
    compareAtPrice: v.compareAtPrice ? String(v.compareAtPrice) : '',
    stock: String(v.stock),
    isActive: v.isActive,
    images: (v.images ?? []).map((img) => ({
      id: String(img.id),
      url: img.url,
      alt: img.alt ?? '',
      sortOrder: img.sortOrder,
    })),
  }
}

function makeInitialValues(data?: ProductWithCategories): ProductFormValues {
  const variants: VariantInput[] =
    data?.variants && data.variants.length > 0
      ? data.variants.map(toFormVariant)
      : [makeEmptyVariant()]

  return {
    name: data?.name ?? '',
    slug: data?.slug ?? '',
    description: data?.description ?? '',
    isActive: data?.isActive ?? true,
    categoryIds:
      data?.categories
        ?.map((item) => item?.categoryId)
        .filter((id): id is number => typeof id === 'number') ?? [],
    designIds: data?.designs?.map((item) => item.designId) ?? [],
    materialIds: data?.materials?.map((item) => item.materialId) ?? [],
    variants,
  }
}

export function ProductForm({ productId }: { productId?: number }) {
  const isEditMode = Boolean(productId)
  const { data, isLoading } = useProductWithId(productId)
  const navigate = useNavigate()
  const { mutateAsync: addProduct } = useAddProduct()
  const { mutateAsync: updateProduct } = useUpdateProduct()

  const form = useForm({
    defaultValues: makeInitialValues(data),
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditMode && productId) {
          await updateProduct({ ...value, id: productId })
        } else {
          await addProduct(value)
        }
        navigate({ to: '/dashboard/products' })
      } catch (error) {
        console.error(error)
      }
    },
  })

  useEffect(() => {
    if (data) {
      form.reset(makeInitialValues(data))
    }
  }, [data])

  const toggleArrayItem = (
    field: 'categoryIds' | 'designIds' | 'materialIds',
    id: number,
  ) => {
    const current = form.getFieldValue(field) as number[]
    form.setFieldValue(
      field,
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    )
    form.validateField(field, 'change')
  }

  const addVariant = () => {
    const current = form.getFieldValue('variants') as VariantInput[]
    form.setFieldValue('variants', [...current, makeEmptyVariant()])
  }

  const removeVariant = (id: string) => {
    const current = form.getFieldValue('variants') as VariantInput[]
    form.setFieldValue(
      'variants',
      current.filter((v) => v.id !== id),
    )
  }

  const updateVariant = (updated: VariantInput) => {
    const current = form.getFieldValue('variants') as VariantInput[]
    form.setFieldValue(
      'variants',
      current.map((v) => (v.id === updated.id ? updated : v)),
    )
  }

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="mx-auto max-w-4xl"
    >
      <HeaderPage
        title={isEditMode ? 'ویرایش محصول' : 'افزودن محصول'}
        description="اطلاعات فرش، تنوع‌ها و دسته‌بندی را تکمیل کنید"
        backLink="/dashboard/products"
      />

      <div className="flex flex-col gap-5">
        <SectionCard
          icon={Info}
          title="اطلاعات پایه"
          description="مشخصات کلی محصول که بین همه‌ی تنوع‌ها مشترک است"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="name"
              validators={{ onChange: productSchema.shape.name }}
              children={(field) => (
                <Field label="نام محصول" required className="sm:col-span-2">
                  <TextInput
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      const slugField = form.getFieldMeta('slug')
                      if (!slugField?.isDirty) {
                        form.setFieldValue('slug', slugify(e.target.value))
                      }
                    }}
                    onBlur={field.handleBlur}
                    placeholder="مثلاً آرتا ۱۲۰۰ شانه"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                    <p className="mt-1 text-xs text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  ) : null}
                </Field>
              )}
            />

            <form.Field
              name="slug"
              validators={{ onChange: productSchema.shape.slug }}
              children={(field) => (
                <Field
                  label="نامک (Slug)"
                  required
                  hint="در آدرس صفحه استفاده می‌شود: /products/slug"
                  className="sm:col-span-2"
                >
                  <TextInput
                    dir="ltr"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="arta-1200"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                    <p className="mt-1 text-xs text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  ) : null}
                </Field>
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <Field label="توضیحات" className="sm:col-span-2">
                  <TextArea
                    rows={4}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="توضیح کامل درباره طرح، جنس و ویژگی‌های فرش..."
                  />
                </Field>
              )}
            />

            <form.Field
              name="isActive"
              children={(field) => (
                <div className="sm:col-span-2">
                  <Toggle
                    checked={field.state.value}
                    onChange={field.handleChange}
                    label="محصول فعال است"
                    description="در صورت غیرفعال بودن، در فروشگاه نمایش داده نمی‌شود"
                  />
                </div>
              )}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={Tags}
          title="دسته‌بندی، طرح و متریال"
          description="می‌توانید چند مورد را همزمان انتخاب کنید"
        >
          <div className="flex flex-col gap-5">
            <form.Field
              name="categoryIds"
              validators={{ onChange: productSchema.shape.categoryIds }}
              children={(field) => (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    دسته‌بندی <span className="text-destructive">*</span>
                  </p>
                  <ChipSelect
                    options={DASH_CATEGORIES}
                    selected={field.state.value}
                    onToggle={(id) => toggleArrayItem('categoryIds', id)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                    <p className="mt-1 text-xs text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="designIds"
              children={(field) => (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">طرح</p>
                  <ChipSelect
                    options={DASH_DESIGNS}
                    selected={field.state.value}
                    onToggle={(id) => toggleArrayItem('designIds', id)}
                  />
                </div>
              )}
            />

            <form.Field
              name="materialIds"
              children={(field) => (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">متریال</p>
                  <ChipSelect
                    options={DASH_MATERIALS}
                    selected={field.state.value}
                    onToggle={(id) => toggleArrayItem('materialIds', id)}
                  />
                </div>
              )}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={Layers}
          title="تنوع‌های محصول"
          description="هر ترکیب ابعاد و رنگ، قیمت و موجودی مستقل دارد"
        >
          <form.Field
            name="variants"
            children={(field) => {
              const variants = field.state.value as VariantInput[]
              const totalStock = variants.reduce(
                (sum, v) => sum + (Number(faToEn(v.stock)) || 0),
                0,
              )

              return (
                <>
                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground">
                    <span>
                      تعداد تنوع:{' '}
                      <span className="font-semibold text-foreground">
                        {toFa(variants.length)}
                      </span>
                    </span>
                    <span>
                      مجموع موجودی:{' '}
                      <span className="font-semibold text-foreground">
                        {toFa(totalStock)}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {variants.map((v, i) => (
                      <VariantEditor
                        key={v.id}
                        variant={v}
                        index={i}
                        canRemove={variants.length > 1}
                        onChange={updateVariant}
                        onRemove={() => removeVariant(v.id)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/50 bg-accent/5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/10"
                  >
                    <PlusCircle className="h-4 w-4" />
                    افزودن تنوع جدید
                  </button>
                </>
              )
            }}
          />
        </SectionCard>
      </div>

      <form.Subscribe
        selector={(s) => ({ isSubmitting: s.isSubmitting })}
        children={({ isSubmitting }) => (
          <div className="sticky bottom-0 z-20 mt-5 flex items-center justify-end gap-3 rounded-2xl border border-border bg-card/90 px-4 py-3 backdrop-blur-md">
            <Link
              to="/dashboard/products"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
            >
              انصراف
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isEditMode ? 'بروزرسانی محصول' : 'ثبت محصول'}
                </>
              )}
            </button>
          </div>
        )}
      />
    </form>
  )
}
