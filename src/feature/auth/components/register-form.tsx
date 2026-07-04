'use client'

import { useState } from 'react'
import { Phone, User, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  isValidName,
  isValidPassword,
  isValidPhone,
} from '../lib/auth'
import { AuthField } from './auth-field'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { completeProfileFn } from '../serverFn/complete-profile'

type Errors = {
  name?: string
  phone?: string
  email?: string
  password?: string
  confirm?: string
}

export function RegisterForm() {
  const router = useRouter()
  const lderData = useLoaderData({
    from: '/_authed/complete-profile',
  })
  const [name, setName] = useState(lderData?.user?.name || '')
  const [phone, setPhone] = useState(lderData?.user?.phone || '')
  const [email, setEmail] = useState(lderData?.user?.email || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!isValidName(name)) next.name = 'نام و نام خانوادگی را وارد کنید'
    if (!isValidPhone(phone))
      next.phone = 'شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = 'ایمیل معتبر وارد کنید'
    if (!isValidPassword(password))
      next.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
    if (confirm !== password) next.confirm = 'تکرار رمز عبور مطابقت ندارد'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    const res = await completeProfileFn({
      data: {
        name,
        email: email.trim() || undefined,
        password,
      },
    })

    if (!res.success) {
      setErrors({ confirm: res.error })
      setLoading(false)
      return
    }

    router.navigate({ to: '/dashboard' })

    // setTimeout(() => {
    //   setLoading(false)
    //   setStep('verify')
    //   startCountdown()
    // }, 1000)
  }

  // function verifyCode(e: React.FormEvent) {
  //   e.preventDefault()
  //   if (!isValidOtp(code)) {
  //     setErrors({ code: 'کد ۶ رقمی پیامک‌شده را وارد کنید' })
  //     return
  //   }
  //   setErrors({})
  //   setLoading(true)
  //   setTimeout(() => setLoading(false), 1200)
  // }

  // if (step === 'verify') {
  //   return (
  //     <form onSubmit={verifyCode} className="flex flex-col gap-4" noValidate>
  //       <div className="rounded-lg bg-secondary px-3 py-2.5 text-sm text-secondary-foreground">
  //         برای تکمیل ثبت‌نام، کد تأیید ارسال‌شده به شماره{' '}
  //         <span dir="ltr" className="font-mono font-medium">
  //           {toEnDigits(phone)}
  //         </span>{' '}
  //         را وارد کنید.
  //       </div>

  //       <div className="flex flex-col gap-1.5">
  //         <span className="text-sm font-medium text-foreground">کد تأیید</span>
  //         <OtpInput value={code} onChange={setCode} />
  //         {errors.code && (
  //           <p className="text-xs text-destructive">{errors.code}</p>
  //         )}
  //       </div>

  //       <div className="text-sm text-muted-foreground">
  //         {seconds > 0 ? (
  //           <span>
  //             ارسال مجدد کد تا{' '}
  //             <span className="font-mono font-medium text-foreground">
  //               {toFaNumber(seconds)}
  //             </span>{' '}
  //             ثانیه دیگر
  //           </span>
  //         ) : (
  //           <button
  //             type="button"
  //             onClick={() => startCountdown()}
  //             className="font-medium text-accent-foreground hover:underline"
  //           >
  //             ارسال مجدد کد
  //           </button>
  //         )}
  //       </div>

  //       <SubmitButton loading={loading}>تأیید و تکمیل ثبت‌نام</SubmitButton>

  //       <button
  //         type="button"
  //         onClick={() => {
  //           setStep('details')
  //           setCode('')
  //           setErrors({})
  //         }}
  //         className="text-sm font-medium text-muted-foreground hover:text-foreground"
  //       >
  //         بازگشت و ویرایش اطلاعات
  //       </button>
  //     </form>
  //   )
  // }

  return (
    <form onSubmit={submitDetails} className="flex flex-col gap-4" noValidate>
      <AuthField
        label="نام و نام خانوادگی"
        placeholder="مثال: مریم رضایی"
        icon={<User className="h-4 w-4" />}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
      />
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
        label="ایمیل (اختیاری)"
        type="email"
        dir="ltr"
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <AuthField
        label="رمز عبور"
        type="password"
        placeholder="حداقل ۸ کاراکتر"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />
      <AuthField
        label="تکرار رمز عبور"
        type="password"
        placeholder="••••••••"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        autoComplete="new-password"
      />

      <SubmitButton loading={loading}>ادامه و دریافت کد تأیید</SubmitButton>
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
