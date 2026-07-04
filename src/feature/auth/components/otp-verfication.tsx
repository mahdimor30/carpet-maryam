"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, RefreshCw } from "lucide-react"

interface OtpVerificationProps {
  phoneNumber: string
  onBack: () => void
  onVerify: () => void
}

export function OtpVerification({ phoneNumber, onBack, onVerify }: OtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(120)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const formatPhoneDisplay = (phone: string) => {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5)
    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 5) newOtp[index] = char
    })
    setOtp(newOtp)
    
    const focusIndex = Math.min(pastedData.length, 4)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = useCallback(async () => {
    const code = otp.join("")
    if (code.length !== 5) {
      setError("لطفاً کد ۵ رقمی را کامل وارد کنید")
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, accept any 5-digit code
    if (code === "12345" || code.length === 5) {
      onVerify()
    } else {
      setError("کد وارد شده صحیح نیست")
    }
    
    setIsLoading(false)
  }, [otp, onVerify])

  const handleResend = async () => {
    setCanResend(false)
    setCountdown(120)
    setOtp(["", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
    
    // Simulate resend
    console.log("[v0] Resending OTP to:", phoneNumber)
  }

  // Auto-submit when all digits are entered
  useEffect(() => {
    if (otp.every(digit => digit !== "") && otp.join("").length === 5) {
      handleSubmit()
    }
  }, [otp, handleSubmit])

  return (
    <div className="space-y-8">
      {/* Mobile Header */}
      <div className="lg:hidden text-center mb-8">
        <h1 className="text-2xl font-bold text-primary">فرش نگار</h1>
        <p className="text-muted-foreground mt-1">فروشگاه آنلاین فرش ایرانی</p>
      </div>

      <Button 
        variant="ghost" 
        onClick={onBack}
        className="gap-2 -mr-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت
      </Button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">تأیید شماره موبایل</h2>
        <p className="text-muted-foreground">
          کد ۵ رقمی ارسال شده به شماره{" "}
          <span className="text-foreground font-medium" dir="ltr">
            {formatPhoneDisplay(phoneNumber)}
          </span>
          {" "}را وارد کنید
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-3 justify-center" dir="ltr">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-2xl font-bold"
              aria-label={`رقم ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        <Button 
          type="button"
          onClick={handleSubmit}
          className="w-full h-12 text-base"
          disabled={isLoading || otp.join("").length !== 5}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>در حال بررسی...</span>
            </div>
          ) : (
            "تأیید و ورود"
          )}
        </Button>

        <div className="text-center">
          {canResend ? (
            <Button 
              variant="ghost" 
              onClick={handleResend}
              className="gap-2 text-primary"
            >
              <RefreshCw className="h-4 w-4" />
              ارسال مجدد کد
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm">
              ارسال مجدد کد تا{" "}
              <span className="text-foreground font-medium">{formatTime(countdown)}</span>
              {" "}دیگر
            </p>
          )}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">راهنما:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>کد تأیید به صورت پیامک ارسال شده است</li>
          <li>در صورت عدم دریافت، پوشه اسپم را بررسی کنید</li>
          <li>برای تست، هر کد ۵ رقمی قبول می‌شود</li>
        </ul>
      </div>
    </div>
  )
}
