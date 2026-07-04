'use client'

import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type AuthFieldProps = {
  label: string
  error?: string
  icon?: ReactNode
  containerClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

export function AuthField({
  label,
  error,
  icon,
  containerClassName,
  className,
  type = 'text',
  ...props
}: AuthFieldProps) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={resolvedType}
          aria-invalid={!!error}
          className={cn(
            'h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors',
            'placeholder:text-muted-foreground/70',
            'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
            'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20',
            icon && 'pr-10',
            isPassword && 'pl-10',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'پنهان کردن رمز' : 'نمایش رمز'}
            className="absolute inset-y-0 left-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
