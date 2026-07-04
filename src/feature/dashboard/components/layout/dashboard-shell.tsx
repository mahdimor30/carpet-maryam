'use client'

import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground/70 hover:bg-secondary lg:hidden"
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden flex-1 max-w-sm sm:block">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="جستجو در پنل..."
              className="w-full rounded-xl border border-border bg-background py-2 pr-10 pl-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
            />
          </div>

          <div className="mr-auto flex items-center gap-2">
            <button
              className="relative rounded-lg p-2 text-foreground/70 hover:bg-secondary"
              aria-label="اعلان‌ها"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background py-1.5 pr-1.5 pl-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                م
              </span>
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-xs font-semibold text-foreground">مدیر فروشگاه</p>
                <p className="text-[11px] text-muted-foreground">admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
