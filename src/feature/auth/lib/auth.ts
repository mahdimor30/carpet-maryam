// اعتبارسنجی سمت کلاینت برای فرم‌های ورود و ثبت‌نام
// نکته: این پروژه فعلاً فقط رابط کاربری است و بک‌اند واقعی ندارد.

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

// تبدیل ارقام فارسی/عربی به انگلیسی برای اعتبارسنجی
export function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

// شماره موبایل ایران: 11 رقم با شروع 09
export function isValidPhone(value: string): boolean {
  const phone = toEnDigits(value).trim()
  return /^09\d{9}$/.test(phone)
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 3
}

export function isValidOtp(value: string): boolean {
  return /^\d{6}$/.test(toEnDigits(value).trim())
}
