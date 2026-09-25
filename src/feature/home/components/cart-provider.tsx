'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
/**
 * کمترین مجموعه فیلدی که سبد خرید برای نمایش و محاسبه لازم دارد؛
 * هم محصولات دیتابیس و هم داده‌های نمونه این شکل را دارند.
 */
export type CartProduct = {
  id: number
  slug: string
  name: string
  price: number
  image: string | null
  size?: string | null
}

type CartItem = { product: CartProduct; qty: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  add: (product: CartProduct, qty?: number) => void
  remove: (id: number) => void
  setQty: (id: number, qty: number) => void
  clear: () => void
}

const STORAGE_KEY = 'maryam-carpet-cart'
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved) as CartItem[])
    } catch {
      // A broken local cart should never block the storefront.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const add = useCallback((product: CartProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, qty: i.qty + Math.max(1, qty) }
            : i,
        )
      }
      return [...prev, { product, qty: Math.max(1, qty) }]
    })
  }, [])

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id))
  }, [])

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product.id !== id)
        : prev.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.qty * i.product.price, 0)

  const value = useMemo(
    () => ({ items, count, total, add, remove, setQty, clear }),
    [items, count, total, add, remove, setQty, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
