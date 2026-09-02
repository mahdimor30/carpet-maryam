'use client'

import { useState } from 'react'
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
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'

const NAV = [
  { to: '/dashboard', label: 'نمای کلی', icon: LayoutDashboard, exact: true },
  {
    label: 'محصولات',
    icon: Package,
    children: [
      { to: '/dashboard/products', label: 'همه محصولات', exact: true },
      { to: '/dashboard/products/new', label: 'افزودن محصول', icon: PlusCircle, exact: true },
    ],
  },
  { to: '/dashboard/taxonomy', label: 'دسته و طرح', icon: Tags },
  { to: '/dashboard/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { to: '/dashboard/inquiries', label: 'استعلام‌ها', icon: MessageSquare },
  { to: '/dashboard/users', label: 'کاربران', icon: Users },
] as const

function isActive(path: string, target: string, exact?: boolean) {
  const p = path.replace(/\/$/, '') || '/'
  const t = target.replace(/\/$/, '') || '/'
  return exact ? p === t : p.startsWith(t)
}

export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { pathname } = useLocation()

  return (
    <>
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
              if ('children' in item) {
                return (
                  <NavGroup
                    key={item.label}
                    item={item as typeof item & { children: { to: string; label: string; icon?: any }[] }}
                    pathname={pathname}
                    onClose={onClose}
                  />
                )
              }
              const active = isActive(pathname, (item as any).to, (item as any).exact)
              const Icon = item.icon
              const to = (item as any).to as string
              return (
                <li key={to}>
                  <Link
                    to={to}
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

function NavGroup({
  item,
  pathname,
  onClose,
}: {
  item: { label: string; icon: any; children: { to: string; label: string; icon?: any }[] }
  pathname: string
  onClose: () => void
}) {
  const hasActiveChild = isActive(pathname, item.children[0].to)
  const [expanded, setExpanded] = useState(() => hasActiveChild)
  const Icon = item.icon

  return (
    <li>
      <button
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          hasActiveChild
            ? 'bg-primary/10 text-primary'
            : 'text-sidebar-foreground/70 hover:bg-secondary hover:text-sidebar-foreground',
        )}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" />
        <span className="flex-1 text-right">{item.label}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            expanded && 'rotate-180',
          )}
        />
      </button>
      {expanded && (
        <ul className="mr-3 mt-1 flex flex-col gap-0.5 border-r border-sidebar-border pr-2">
          {item.children.map((child) => {
            const active = isActive(pathname, child.to, (child as any).exact)
            return (
              <li key={child.to}>
                <Link
                  to={child.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-secondary hover:text-sidebar-foreground',
                  )}
                >
                  {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                  {child.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
