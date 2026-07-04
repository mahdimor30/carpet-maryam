'use client'

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  ShoppingCart,
  MessageSquare,
  Users,
  Store,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

const NAV = [
  { to: '/dashboard', label: 'نمای کلی', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/products', label: 'محصولات', icon: Package },
  { to: '/dashboard/products/new', label: 'افزودن محصول', icon: PlusCircle },
  { to: '/dashboard/taxonomy', label: 'دسته و طرح', icon: Tags },
  { to: '/dashboard/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { to: '/dashboard/inquiries', label: 'استعلام‌ها', icon: MessageSquare },
  { to: '/dashboard/users', label: 'کاربران', icon: Users },
] as const

export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  // const {pathname} = useRouter()

  return (
    <>
      {/* پوشش موبایل */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-sidebar-foreground">
                فرش مریم
              </p>
              <p className="text-xs text-muted-foreground">پنل مدیریت</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = false // TODO: fix active state
              // const active = item.exact
              //   ? pathname === item.href
              //   : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <Link
                    to={item.to as string}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-secondary hover:text-sidebar-foreground',
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
          >
            <Store className="h-4 w-4" />
            مشاهده فروشگاه
          </Link>
        </div>
      </aside>
    </>
  )
}
