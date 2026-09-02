'use client'

import { Pencil, Eye, EyeOff } from 'lucide-react'
import { formatToman, toFa } from '@/lib/dashboard-data'
import { Link } from '@tanstack/react-router'

interface ProductRow {
  id: number
  name: string
  slug: string
  categories: string[]
  variants: number
  minPrice: number
  totalStock: number
  isActive: boolean
}

export function ProductsTable({
  limit,
  products,
}: {
  limit?: number
  products?: ProductRow[]
}) {
  const rows = products ?? []

  const displayedRows = limit ? rows.slice(0, limit) : rows

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">نام محصول</th>
              <th className="px-4 py-3 font-medium">دسته‌بندی</th>
              <th className="px-4 py-3 font-medium">تنوع</th>
              <th className="px-4 py-3 font-medium">شروع قیمت</th>
              <th className="px-4 py-3 font-medium">موجودی</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/60 text-sm last:border-0 hover:bg-secondary/40"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p
                    className="font-mono text-xs text-muted-foreground"
                    dir="ltr"
                  >
                    {p.slug}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {toFa(p.variants)} نوع
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatToman(p.minPrice)}{' '}
                  <span className="text-xs text-muted-foreground">تومان</span>
                </td>
                <td className="px-4 py-3 text-foreground">
                  {toFa(p.totalStock)}
                </td>
                <td className="px-4 py-3">
                  {p.isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/15 px-2 py-0.5 text-xs font-medium text-chart-4">
                      <Eye className="h-3 w-3" /> فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      <EyeOff className="h-3 w-3" /> غیرفعال
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/dashboard/products/$id`}
                    params={{
                      id: Number(p.id),
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
