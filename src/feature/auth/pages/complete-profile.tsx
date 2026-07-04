import { Link } from "@tanstack/react-router"
import { AuthShell } from "../components/auth-shell"
import { RegisterForm } from "../components/register-form"

export default function RegisterPage() {
  return (
    <AuthShell
      title="ساخت حساب کاربری"
      subtitle="با چند ثانیه ثبت‌نام، خریدی مطمئن و پیگیری آسان سفارش‌ها را تجربه کنید."
      footer={
        <>
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link
            to="/login"
            className="font-semibold text-accent-foreground hover:underline"
          >
            وارد شوید
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  )
}
