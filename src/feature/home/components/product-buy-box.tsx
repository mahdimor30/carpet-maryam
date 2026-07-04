'use client'

import { useState } from 'react'
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import { type Product, formatPrice, toFaNumber } from '@/lib/data'
import { useCart } from '@/feature/home/components/cart-provider'

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    for (let i = 0; i < qty; i++) add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="کاهش تعداد"
            className="flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-8 text-center text-base font-semibold">
            {toFaNumber(qty)}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="افزایش تعداد"
            className="flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              به سبد اضافه شد
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              افزودن به سبد خرید
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        قیمت کل:{' '}
        <span className="font-bold text-foreground">
          {formatPrice(product.price * qty)} تومان
        </span>
      </p>
    </div>
  )
}
