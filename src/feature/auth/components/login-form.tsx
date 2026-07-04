import { useEffect, useRef, useState } from 'react'
import { Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { toFaNumber } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  isValidOtp,
  isValidPassword,
  isValidPhone,
  toEnDigits,
} from '../lib/auth'
import { AuthField } from './auth-field'
import { Link, useRouter } from '@tanstack/react-router'
import { OtpInput } from './otp-input'
import { loginFn } from '../serverFn/login-fn'
import { verifyOtpFn } from '../serverFn/verfy-otp'

type Method = 'password' | 'otp'
type OtpStep = 'phone' | 'code'

export function LoginForm() {
  const [method, setMethod] = useState<Method>('password')

  return (
    <div className="flex flex-col gap-6">
      {/* انتخاب روش ورود */}
      <div
        role="tablist"
        aria-label="روش ورود"
        className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1"
      >
        <TabButton
          active={method === 'password'}
          onClick={() => setMethod('password')}
        >
          ورود با رمز عبور
        </TabButton>
        <TabButton active={method === 'otp'} onClick={() => setMethod('otp')}>
          ورود با کد یکبارمصرف
        </TabButton>
      </div>

      {method === 'password' ? <PasswordLogin /> : <OtpLogin />}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function PasswordLogin() {
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

function OtpLogin() {
  const router = useRouter()
  const [step, setStep] = useState<OtpStep>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({})
  const [loading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function startCountdown() {
    setSeconds(120)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1 && timerRef.current) clearInterval(timerRef.current)
        return s > 0 ? s - 1 : 0
      })
    }, 1000)
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidPhone(phone)) {
      setErrors({ phone: 'شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)' })
      return
    }
    setErrors({})
    setLoading(true)
    const loginResult = await loginFn({
      data: {
        phone,
      },
    })

    if (loginResult.success) {
      setStep('code')
      setLoading(false)
      startCountdown()
    }
    // setTimeout(() => {
    //   setLoading(false)
    //   setStep('code')
    //   startCountdown()
    // }, 1000)
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidOtp(code)) {
      setErrors({ code: 'کد ۶ رقمی پیامک‌شده را وارد کنید' })
      return
    }
    setErrors({})
    setLoading(true)

    const result = await verifyOtpFn({
      data: {
        phone,
        otpCode: code,
      },
    })

    if (result.success) {
      router.navigate({ to: '/dashboard' })
      // Handle successful OTP verification
    }
    setLoading(false)
  }

  if (step === 'phone') {
    return (
      <form onSubmit={sendCode} className="flex flex-col gap-4" noValidate>
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
        <p className="text-xs leading-relaxed text-muted-foreground">
          یک کد ۶ رقمی برای ورود به این شماره پیامک می‌شود.
        </p>
        <SubmitButton loading={loading}>ارسال کد تأیید</SubmitButton>
      </form>
    )
  }

  return (
    <form onSubmit={verifyCode} className="flex flex-col gap-4" noValidate>
      <div className="rounded-lg bg-secondary px-3 py-2.5 text-sm text-secondary-foreground">
        کد تأیید به شماره{' '}
        <span dir="ltr" className="font-mono font-medium">
          {toEnDigits(phone)}
        </span>{' '}
        ارسال شد.{' '}
        <button
          type="button"
          onClick={() => {
            setStep('phone')
            setCode('')
            setErrors({})
          }}
          className="font-medium text-accent-foreground hover:underline"
        >
          ویرایش شماره
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">کد تأیید</span>
        <OtpInput value={code} onChange={setCode} />
        {errors.code && (
          <p className="text-xs text-destructive">{errors.code}</p>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {seconds > 0 ? (
          <span>
            ارسال مجدد کد تا{' '}
            <span className="font-mono font-medium text-foreground">
              {toFaNumber(seconds)}
            </span>{' '}
            ثانیه دیگر
          </span>
        ) : (
          <button
            type="button"
            onClick={() => startCountdown()}
            className="font-medium text-accent-foreground hover:underline"
          >
            ارسال مجدد کد
          </button>
        )}
      </div>

      <SubmitButton loading={loading}>تأیید و ورود</SubmitButton>
    </form>
  )
}

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading}
      className="h-11 w-full text-sm font-semibold"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
