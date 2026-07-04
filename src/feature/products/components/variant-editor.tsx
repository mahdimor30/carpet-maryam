import { Trash2, ImagePlus, X, ChevronDown, Upload, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { COLOR_PRESETS, DIMENSION_PRESETS, faToEn, formatToman, makeEmptyImage, toFa, type VariantInput } from '@/lib/dashboard-data'
import { Field, TextInput, Toggle } from './form-controls'

export function VariantEditor({
  variant,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  variant: VariantInput
  index: number
  canRemove: boolean
  onChange: (v: VariantInput) => void
  onRemove: () => void
}) {
  const [openImages, setOpenImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const set = <K extends keyof VariantInput>(key: K, value: VariantInput[K]) =>
    onChange({ ...variant, [key]: value })

  const priceNum = Number(faToEn(variant.price)) || 0
  const compareNum = Number(faToEn(variant.compareAtPrice)) || 0
  const discount =
    compareNum > priceNum && priceNum > 0
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : 0

  const addImage = () =>
    set('images', [...variant.images, makeEmptyImage(variant.images.length)])

  const updateImage = (id: string, key: 'url' | 'alt', value: string) =>
    set(
      'images',
      variant.images.map((img) => (img.id === id ? { ...img, [key]: value } : img)),
    )

  const removeImage = (id: string) =>
    set(
      'images',
      variant.images.filter((img) => img.id !== id),
    )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploadError(null)
    setIsUploading(true)

    try {
      const uploaded: { url: string }[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/temp-upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({} as Record<string, unknown>))
          throw new Error(typeof errBody === 'object' && errBody && 'error' in errBody ? String(errBody.error) : `خطا در آپلود ${file.name}`)
        }

        const data = await res.json() as { url: string }
        uploaded.push(data)
      }

      const newImages = uploaded.map((f, i) => ({
        ...makeEmptyImage(variant.images.length + i),
        url: f.url,
      }))
      set('images', [...variant.images, ...newImages])
    } catch (err) {
      console.error(err)
      setUploadError(err instanceof Error ? err.message : 'خطا در آپلود تصویر')
    } finally {
      setIsUploading(false)
    }

    e.target.value = ''
  }

  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">
            {toFa(index + 1)}
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            {variant.dimension || variant.color
              ? [variant.dimension, variant.color].filter(Boolean).join(' / ')
              : 'تنوع جدید'}
          </h4>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-1.5 text-destructive transition-colors hover:bg-destructive/10"
            aria-label="حذف تنوع"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="ابعاد" required>
          <TextInput
            list="dimension-presets"
            value={variant.dimension}
            onChange={(e) => set('dimension', e.target.value)}
            placeholder="مثلاً ۹ متری یا ۲۰۰×۳۰۰"
          />
          <datalist id="dimension-presets">
            {DIMENSION_PRESETS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </Field>

        <Field label="رنگ" required>
          <TextInput
            value={variant.color}
            onChange={(e) => set('color', e.target.value)}
            placeholder="مثلاً کرم"
          />
        </Field>

        <Field label="کد رنگ (Hex)" hint="برای نمایش سواچ رنگ">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={variant.colorHex || '#cdbb9a'}
              onChange={(e) => set('colorHex', e.target.value)}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
              aria-label="انتخاب رنگ"
            />
            <TextInput
              dir="ltr"
              value={variant.colorHex}
              onChange={(e) => set('colorHex', e.target.value)}
              placeholder="#cdbb9a"
            />
          </div>
        </Field>

        <Field label="کد انبار (SKU)">
          <TextInput
            dir="ltr"
            value={variant.sku}
            onChange={(e) => set('sku', e.target.value)}
            placeholder="ARTA-1200-9M-CRM"
          />
        </Field>

        <Field label="قیمت (تومان)" required>
          <TextInput
            inputMode="numeric"
            value={variant.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="4800000"
          />
        </Field>

        <Field
          label="قیمت قبل از تخفیف"
          hint={discount > 0 ? `${toFa(discount)}٪ تخفیف اعمال می‌شود` : undefined}
        >
          <TextInput
            inputMode="numeric"
            value={variant.compareAtPrice}
            onChange={(e) => set('compareAtPrice', e.target.value)}
            placeholder="5500000"
          />
        </Field>

        <Field label="موجودی انبار" required>
          <TextInput
            inputMode="numeric"
            value={variant.stock}
            onChange={(e) => set('stock', e.target.value)}
            placeholder="0"
          />
        </Field>

        <div className="sm:col-span-2 lg:col-span-1">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            رنگ‌های پیشنهادی
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.name}
                onClick={() => {
                  set('color', c.name)
                  set('colorHex', c.hex)
                }}
                className={cn(
                  'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                  variant.colorHex.toLowerCase() === c.hex.toLowerCase()
                    ? 'border-accent ring-2 ring-accent/40'
                    : 'border-border',
                )}
                style={{ backgroundColor: c.hex }}
              >
                <span className="sr-only">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* تصاویر و وضعیت */}
      <div className="border-t border-border px-4 py-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            checked={variant.isActive}
            onChange={(v) => set('isActive', v)}
            label="تنوع فعال است"
            description="در فروشگاه نمایش داده شود"
          />
          <button
            type="button"
            onClick={() => setOpenImages((o) => !o)}
            className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
          >
            <span className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              گالری تصاویر ({toFa(variant.images.length)})
            </span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', openImages && 'rotate-180')}
            />
          </button>
        </div>

        {openImages && (
          <div className="mt-3 flex flex-col gap-3">
            {/* تصاویر موجود */}
            {variant.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {variant.images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card"
                  >
                    {img.url ? (
                      <img
                        src={img.url}
                        alt={img.alt || ''}
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground">
                        بدون تصویر
                      </div>
                    )}
                    <div className="flex items-center gap-1 border-t border-border p-1.5">
                      <input
                        value={img.alt}
                        onChange={(e) => updateImage(img.id, 'alt', e.target.value)}
                        placeholder="متن جایگزین"
                        className="min-w-0 flex-1 rounded-md border border-border bg-background px-1.5 py-1 text-[11px] text-foreground outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="rounded-md p-1 text-destructive hover:bg-destructive/10"
                        aria-label="حذف تصویر"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-destructive">{uploadError}</p>
            )}

            {/* دکمه آپلود / افزودن */}
            <div className="flex items-center gap-2">
              {isUploading ? (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال آپلود...
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary/40"
                  >
                    <Upload className="h-4 w-4" />
                    آپلود تصویر
                  </button>
                  <button
                    type="button"
                    onClick={addImage}
                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary/40"
                    title="ورود دستی لینک تصویر"
                  >
                    <ImagePlus className="h-4 w-4" />
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {priceNum > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            قیمت نمایشی:{' '}
            <span className="font-semibold text-foreground">
              {formatToman(priceNum)} تومان
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
