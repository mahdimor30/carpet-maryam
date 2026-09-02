import { CATEGORIES, toFaNumber } from '@/lib/data'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Menu,
  Search,
  ShoppingBag,
  X,
  LogIn,
  LayoutDashboard,
} from 'lucide-react'
import { useCart } from '@/feature/home/components/cart-provider'
import { CartDrawer } from '@/feature/home/components/cart-drawer'
import { getCurrentUserFn } from '@/feature/auth/serverFn/get-user-cuemt'
import Logo from './logo'
import Navigation from './navigation'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [user, setUser] = useState<
    { id: number; name?: string | null; role: string } | null | undefined
  >(undefined)
  const { count } = useCart()

  useEffect(() => {
    getCurrentUserFn()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const isLoggedIn = user != null

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <Navigation />
          {/* اکشن‌ها */}
          <div className="flex items-center gap-1.5">
            <Link
              to="/products"
              search={{}}
              aria-label="جستجو"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="سبد خرید"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                  {toFaNumber(count)}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                aria-label="داشبورد"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/login"
                aria-label="ورود"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogIn className="h-5 w-5" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="منو"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-border" />
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/products"
                  search={{ cat: cat.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-secondary"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {toFaNumber(cat.count)}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
