import { useRouter } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { isValidOtp, isValidPhone, toEnDigits } from '../lib/auth'
import { loginFn } from '../serverFn/login-fn'
import { verifyOtpFn } from '../serverFn/verfy-otp'
import { AuthField } from './auth-field'
import { Phone } from 'lucide-react'
import SubmitButton from './submit-button'
import { OtpInput } from './otp-input'
import { toFaNumber } from '@/lib/data'

type OtpStep = 'phone' | 'code'

export default function OtpLogin() {
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

    console.log(loginResult)

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
    try {
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
        // Handle successful OTP verificationu
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
      
    }
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
