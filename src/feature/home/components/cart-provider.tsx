'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/data'

type CartItem = { product: Product; qty: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  add: (product: Product) => void
  remove: (id: number) => void
  setQty: (id: number, qty: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [...prev, { product, qty: 1 }]
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

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.qty * i.product.price, 0)

  const value = useMemo(
    () => ({ items, count, total, add, remove, setQty }),
    [items, count, total, add, remove, setQty],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
