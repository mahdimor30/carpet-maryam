import { useState } from 'react'
import { Layers, Palette, Pencil, PlusCircle, Sparkles, Trash2, X, Loader2, ImageUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { slugify, toFa } from '@/lib/dashboard-data'
import { Field, TextInput } from '@/feature/products/components/form-controls'
import {
  useTaxonomies,
  useCreateTaxonomy,
  useUpdateTaxonomy,
  useDeleteTaxonomy,
} from '@/feature/products/hooks/use-taxonomies'
import { useUploadThing } from '@/lib/uploadthing'

type Axis = 'category' | 'design' | 'material'

interface TaxonomyItem {
  id: number
  name: string
  slug: string
  image: string | null
}

const AXES: { key: Axis; label: string; singular: string; icon: typeof Layers }[] = [
  { key: 'category', label: 'دسته‌بندی‌ها', singular: 'دسته‌بندی', icon: Layers },
  { key: 'design', label: 'طرح‌ها', singular: 'طرح', icon: Sparkles },
  { key: 'material', label: 'متریال‌ها', singular: 'متریال', icon: Palette },
]

export default function TaxonomyManager() {
  const [tab, setTab] = useState<Axis>('category')

  const { data, isLoading } = useTaxonomies()
  const { mutateAsync: addItem, isPending: isAdding } = useCreateTaxonomy()
  const { mutateAsync: editItem, isPending: isEditing } = useUpdateTaxonomy()
  const { mutateAsync: removeItem, isPending: isDeleting } = useDeleteTaxonomy()

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [editTarget, setEditTarget] = useState<TaxonomyItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editImage, setEditImage] = useState<string | null>(null)
  const [addImage, setAddImage] = useState<string | null>(null)

  const { startUpload: uploadImage, isUploading: isUploading } = useUploadThing('temporaryImage')

  const items: TaxonomyItem[] = data?.[tab === 'category' ? 'categories' : tab === 'design' ? 'designs' : 'materials'] ?? []
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
    const result = await addItem({ type: tab, name: trimmed, slug, image: addImage })
    if (result) {
      setName('')
      setAddImage(null)
      setError('')
    } else {
      setError('خطا در افزودن مورد')
    }
  }

  async function handleAddImage(files: File[]) {
    const res = await uploadImage(files)
    if (res?.[0]?.url) setAddImage(res[0].url)
  }

  function openEdit(item: TaxonomyItem) {
    setEditTarget(item)
    setEditName(item.name)
    setEditSlug(item.slug)
    setEditImage(item.image)
  }

  async function handleEditSave() {
    if (!editTarget) return
    const trimmed = editName.trim()
    if (trimmed.length < 2) return
    const slug = slugify(trimmed)
    if (items.some((i) => i.slug === slug && i.id !== editTarget.id)) {
      setError('موردی با این نام/شناسه از قبل وجود دارد')
      return
    }
    await editItem({ type: tab, id: editTarget.id, name: trimmed, slug, image: editImage })
    setEditTarget(null)
    setError('')
  }

  async function handleEditImage(files: File[]) {
    const res = await uploadImage(files)
    if (res?.[0]?.url) setEditImage(res[0].url)
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
        <div className="flex gap-2">
          <label className="inline-flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary">
            <ImageUp className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const files = e.target.files
                if (files?.length) handleAddImage(Array.from(files))
              }}
            />
          </label>
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
        </div>
      </form>

      {addImage && (
        <div className="-mt-4 mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <img src={addImage} alt="" className="h-8 w-8 rounded-lg object-cover" />
          عکس انتخاب شد
          <button
            type="button"
            onClick={() => setAddImage(null)}
            className="mr-auto text-destructive hover:underline"
          >
            حذف عکس
          </button>
        </div>
      )}

      {error && (
        <p className="-mt-4 mb-4 text-xs text-destructive sm:hidden">{error}</p>
      )}

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
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <ImageUp className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="font-mono text-xs text-muted-foreground" dir="ltr">
                      {item.slug}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`ویرایش ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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

      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4"
          onClick={() => setEditTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="ویرایش"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-base font-bold text-foreground">
                ویرایش {activeAxis.singular}
              </h2>
              <button
                onClick={() => setEditTarget(null)}
                aria-label="بستن"
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="نام">
                <TextInput value={editName} onChange={(e) => setEditName(e.target.value)} />
              </Field>
              <Field label="شناسه (slug)">
                <TextInput
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  dir="ltr"
                  className="font-mono text-left"
                />
              </Field>
              <Field label="عکس">
                <div className="flex items-center gap-3">
                  {editImage ? (
                    <img src={editImage} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <ImageUp className="h-5 w-5" />
                    </div>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
                    {editImage ? 'تغییر عکس' : 'انتخاب عکس'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const files = e.target.files
                        if (files?.length) handleEditImage(Array.from(files))
                      }}
                    />
                  </label>
                  {editImage && (
                    <button
                      type="button"
                      onClick={() => setEditImage(null)}
                      className="text-xs text-destructive hover:underline"
                    >
                      حذف
                    </button>
                  )}
                </div>
              </Field>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditTarget(null)}
                className="rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
              >
                انصراف
              </button>
              <button
                onClick={handleEditSave}
                disabled={isEditing}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isEditing && <Loader2 className="h-4 w-4 animate-spin" />}
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
