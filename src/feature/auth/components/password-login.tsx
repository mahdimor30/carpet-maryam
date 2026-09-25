import { useState } from 'react'
import { isValidPassword, isValidPhone } from '../lib/auth'
import { loginFn } from '../serverFn/login-fn'
import { AuthField } from './auth-field'
import { Link } from '@tanstack/react-router'
import SubmitButton from './submit-button'
import { Phone } from 'lucide-react'

export default function PasswordLogin() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {},
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isValidPhone(phone))
      next.phone = 'شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'
    if (!isValidPassword(password))
      next.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)

    await loginFn({
      data: {
        phone,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <AuthField
        label="شماره موبایل"
        type="tel"
        inputMode="numeric"
        dir="ltr"
        placeholder="09xxxxxxxxx"
        icon={<Phone className="h-4 w-4" />}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
        autoComplete="tel"
      />
      <AuthField
        label="رمز عبور"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input accent-accent"
          />
          مرا به خاطر بسپار
        </label>
        <Link
          to="/"
          className="font-medium text-accent-foreground hover:underline"
        >
          فراموشی رمز عبور؟
        </Link>
      </div>

      <SubmitButton loading={loading}>ورود به حساب</SubmitButton>
    </form>
  )
}
