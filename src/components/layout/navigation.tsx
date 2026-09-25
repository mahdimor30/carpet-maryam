import { Link } from '@tanstack/react-router'

export const NAV_LINKS = [
  { to: '/', label: 'خانه' },
  { to: '/products', label: 'فروشگاه' },
  { to: '/categories', label: 'دسته‌بندی‌ها' },
]

export default function Navigation() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
