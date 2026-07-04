
import { useRef } from 'react'
import { toEnDigits } from '../lib/auth'

type OtpInputProps = {
  value: string
  onChange: (value: string) => void
  length?: number
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.split('')

  function setDigit(index: number, char: string) {
    const clean = toEnDigits(char).replace(/\D/g, '')
    const arr = value.split('')
    arr[index] = clean.slice(-1) ?? ''
    const next = arr.join('').slice(0, length)
    onChange(next)
    if (clean && index < length - 1) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = toEnDigits(e.clipboardData.getData('text'))
      .replace(/\D/g, '')
      .slice(0, length)
    if (pasted) {
      onChange(pasted)
      refs.current[Math.min(pasted.length, length - 1)]?.focus()
    }
  }

  return (
    <div dir="ltr" className="flex justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          inputMode="numeric"
          maxLength={1}
          value={digits[i] ?? ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`رقم ${i + 1}`}
          className="h-12 w-full rounded-lg border border-input bg-background text-center font-mono text-lg text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      ))}
    </div>
  )
}
