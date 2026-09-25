import PasswordLogin from './password-login'
import OtpLogin from './otp-login'
import TabButton from './tab-button'
import { useState } from 'react'

type Method = 'password' | 'otp'

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
