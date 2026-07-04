import { useState } from 'react'
import { Layers, Palette, PlusCircle, Sparkles, Trash2, X, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { slugify, toFa } from '@/lib/dashboard-data'
import { Field, TextInput } from '@/feature/products/components/form-controls'
import {
  useTaxonomies,
  useCreateTaxonomy,
  useDeleteTaxonomy,
} from '@/feature/products/hooks/use-taxonomies'

type Axis = 'category' | 'design' | 'material'

const AXES: { key: Axis; label: string; singular: string; icon: typeof Layers }[] = [
  { key: 'category', label: 'دسته‌بندی‌ها', singular: 'دسته‌بندی', icon: Layers },
  { key: 'design', label: 'طرح‌ها', singular: 'طرح', icon: Sparkles },
  { key: 'material', label: 'متریال‌ها', singular: 'متریال', icon: Palette },
]

export default function TaxonomyManager() {
  const [tab, setTab] = useState<Axis>('category')

  const { data, isLoading } = useTaxonomies()
  const { mutateAsync: addItem, isPending: isAdding } = useCreateTaxonomy()
  const { mutateAsync: removeItem, isPending: isDeleting } = useDeleteTaxonomy()

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const items = data?.[tab === 'category' ? 'categories' : tab === 'design' ? 'designs' : 'materials'] ?? []
  const activeAxis = AXES.find((a) => a.key === tab)!

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('نام باید حداقل ۲ کاراکتر باشد')
      return
    }
    const slug = slugify(trimmed)
    if (items.some((i) => i.slug === slug)) {
      setError('موردی با این نام/شناسه از قبل وجود دارد')
      return
    }
    const result = await addItem({ type: tab, name: trimmed, slug })
    if (result) {
      setName('')
      setError('')
    } else {
      setError('خطا در افزودن مورد')
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return
    await removeItem({ type: tab, id: deleteTarget.id })
    setDeleteTarget(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          دسته‌بندی و طرح
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          مدیریت دسته‌بندی‌ها، طرح‌ها و متریال‌های قابل استفاده برای محصولات
        </p>
      </div>

      {/* تب‌ها */}
      <div
        role="tablist"
        aria-label="محور طبقه‌بندی"
        className="mb-6 inline-flex gap-1 rounded-xl bg-secondary p-1"
      >
        {AXES.map((a) => {
          const Icon = a.icon
          const active = tab === a.key
          const count = tab === a.key ? items.length : 0
          return (
            <button
              key={a.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setTab(a.key)
                setName('')
                setError('')
              }}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {a.label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {toFa(count)}
              </span>
            </button>
          )
        })}
      </div>

      {/* فرم افزودن */}
      <form
        onSubmit={handleAdd}
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end"
      >
        <Field
          label={`افزودن ${activeAxis.singular} جدید`}
          hint={error || `مثال: ${activeAxis.key === 'category' ? 'گبه' : activeAxis.key === 'design' ? 'ترنج' : 'پشم مرینو'}`}
          className="flex-1"
        >
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder={`نام ${activeAxis.singular}`}
            aria-invalid={!!error}
            className={error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : undefined}
          />
        </Field>
        <button
          type="submit"
          disabled={isAdding}
          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          افزودن
        </button>
      </form>

      {error && (
        <p className="-mt-4 mb-4 text-xs text-destructive sm:hidden">{error}</p>
      )}

      {/* فهرست */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {items.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            هنوز موردی اضافه نشده است.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/40"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="font-mono text-xs text-muted-foreground" dir="ltr">
                    {item.slug}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({ id: item.id, name: item.name })
                  }
                  aria-label={`حذف ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* تأیید حذف */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="تأیید حذف"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-base font-bold text-foreground">
                حذف {activeAxis.singular}
              </h2>
              <button
                onClick={() => setDeleteTarget(null)}
                aria-label="بستن"
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              آیا از حذف «{deleteTarget.name}» مطمئن هستید؟ محصولاتی که به این مورد
              متصل‌اند، این برچسب را از دست می‌دهند.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
              >
                انصراف
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
