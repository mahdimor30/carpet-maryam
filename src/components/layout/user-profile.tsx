import useAuth from '@/feature/auth/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import { LayoutDashboardIcon, LogIn } from 'lucide-react'

export default function UserProfile() {
  const { data } = useAuth()
  const isLoggedIn = data

  return isLoggedIn ? (
    <Link
      to="/dashboard"
      aria-label="داشبورد"
      className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
    >
      <LayoutDashboardIcon className="h-5 w-5" />
    </Link>
  ) : (
    <Link
      to="/login"
      aria-label="ورود"
      className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
    >
      <LogIn className="h-5 w-5" />
    </Link>
  )
}
