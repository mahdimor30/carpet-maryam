import { createServerFn } from '@tanstack/react-start'

import { sendOtp } from '../services/send-otp'
import { sendOtpSchema } from '../validation/auth.validation'

export const sendOtpAction = createServerFn({
  method: 'POST',
})
  .inputValidator(sendOtpSchema)
  .handler(async ({ data }) => {
    return sendOtp({
      phone: data.phone,
    })
  })
