'use client'

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { formatPrice, toFaNumber } from '@/lib/data'
import { useCart } from './cart-provider'

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { items, total, setQty, remove, count } = useCart()

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* پس‌زمینه */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/30 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* کشو */}
      <aside
        className={`absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <h2 className="font-heading text-base font-bold text-foreground">
              سبد خرید
            </h2>
            <span className="text-sm text-muted-foreground">
              ({toFaNumber(count)})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              سبد خرید شما خالی است
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-3">
              {items.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {product.size} متر
                        </p>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        aria-label="حذف"
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-border">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="کاهش"
                          className="flex h-7 w-7 items-center justify-center text-foreground/70 hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-medium">
                          {toFaNumber(qty)}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="افزایش"
                          className="flex h-7 w-7 items-center justify-center text-foreground/70 hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {formatPrice(product.price * qty)}
                        <span className="mr-1 text-xs font-normal text-muted-foreground">
                          تومان
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">مجموع</span>
              <span className="font-heading text-lg font-bold text-foreground">
                {formatPrice(total)}
                <span className="mr-1 text-sm font-normal text-muted-foreground">
                  تومان
                </span>
              </span>
            </div>
            <button className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              تکمیل خرید
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
