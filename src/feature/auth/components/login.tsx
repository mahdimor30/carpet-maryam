import { Link } from '@tanstack/react-router'
import { AuthShell } from './auth-shell'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <AuthShell
      title="ورود به حساب"
      subtitle="برای پیگیری سفارش‌ها و خرید سریع‌تر وارد حساب کاربری خود شوید."
      footer={
        <>
          حساب کاربری ندارید؟{' '}
          <Link
            to="/complete-profile"
            className="font-semibold text-accent-foreground hover:underline"
          >
            ثبت‌نام کنید
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
