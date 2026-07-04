'use client'


import { useState } from 'react'
import { ArrowLeft, Layers, Palette, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES, DESIGNS, MATERIALS, PRODUCTS, toFaNumber } from '@/lib/data'
import { Link } from '@tanstack/react-router'

type Axis = 'category' | 'design' | 'material'

const TABS: { key: Axis; label: string; icon: typeof Layers }[] = [
  { key: 'category', label: 'دسته‌بندی', icon: Layers },
  { key: 'design', label: 'طرح', icon: Sparkles },
  { key: 'material', label: 'متریال', icon: Palette },
]

function representativeImage(predicate: (p: (typeof PRODUCTS)[number]) => boolean) {
  return PRODUCTS.find(predicate)?.image || '/placeholder.svg'
}

export function TaxonomyBrowser() {
  const [tab, setTab] = useState<Axis>('category')

  const items =
    tab === 'category'
      ? CATEGORIES.map((c) => ({
          slug: c.slug,
          name: c.name,
          count: c.count,
          image: representativeImage((p) => p.categorySlug === c.slug),
        }))
      : tab === 'design'
        ? DESIGNS.map((d) => ({
            slug: d.slug,
            name: d.name,
            count: d.count,
            image: representativeImage((p) => p.designSlug === d.slug),
          }))
        : MATERIALS.map((m) => ({
            slug: m.slug,
            name: m.name,
            count: m.count,
            image: representativeImage((p) => p.materialSlug === m.slug),
          }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          دسته‌بندی‌ها و طرح‌ها
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          فرش مورد نظر خود را بر اساس دسته، طرح یا جنس انتخاب کنید.
        </p>
      </div>

      {/* تب‌ها */}
      <div
        role="tablist"
        aria-label="محور دسته‌بندی"
        className="mb-8 inline-flex gap-1 rounded-xl bg-secondary p-1"
      >
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* شبکه آیتم‌ها */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            to="/products"
            search={{ [tab === 'category' ? 'cat' : tab === 'design' ? 'design' : 'material']: item.slug }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-transparent" />
            </div>
            <div className="flex items-center justify-between gap-2 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {toFaNumber(item.count)} مدل
                </p>
              </div>
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
