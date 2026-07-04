/**
 * lib/uploadthing.ts
 * کامپوننت‌ها و hook های typed برای استفاده در UI
 *
 * استفاده در کامپوننت:
 *   import { UploadButton, UploadDropzone, useUploadThing } from '@/lib/uploadthing'
 */
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react'
import type { UploadRouter } from '../server/uploadthing'

// ─── کامپوننت دکمه آپلود ───────────────────────────────────────────────────
export const UploadButton = generateUploadButton<UploadRouter>()

// ─── کامپوننت drag & drop ──────────────────────────────────────────────────
export const UploadDropzone = generateUploadDropzone<UploadRouter>()

// ─── hook برای آپلود برنامه‌نویسانه ─────────────────────────────────────────
export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>({
  url: '/api/uploadthing',
})

// ─── مثال استفاده VariantImageUploader ────────────────────────────────────
/**
 * مثال کامپوننت آپلود عکس فرش:
 *
 * import { UploadDropzone } from '@/lib/uploadthing'
 *
 * function VariantImageUploader({ variantId }: { variantId: number }) {
 *   return (
 *     <UploadDropzone
 *       endpoint="variantImage"
 *       input={{ variantId }}           // اگر middleware از body می‌خونه
 *       // یا اگر از query string می‌خونه، URL را تنظیم کن:
 *       url={`/api/uploadthing?variantId=${variantId}`}
 *       onClientUploadComplete={(files) => {
 *         console.log('آپلود شد:', files)
 *         // files[0].serverData.imageId => id در دیتابیس
 *         // files[0].serverData.url     => لینک عمومی
 *       }}
 *       onUploadError={(err) => {
 *         alert(`خطا: ${err.message}`)
 *       }}
 *     />
 *   )
 * }
 *
 * ─── مثال آپلود پروفایل ────────────────────────────────────────────────────
 *
 * function ProfileImageUploader() {
 *   return (
 *     <UploadButton
 *       endpoint="profileImage"
 *       onClientUploadComplete={(files) => {
 *         console.log('عکس پروفایل آپلود شد:', files[0].url)
 *       }}
 *       onUploadError={(err) => alert(err.message)}
 *     />
 *   )
 * }
 *
 * ─── مثال آپلود برنامه‌نویسانه با hook ────────────────────────────────────
 *
 * function CustomUploader({ variantId }: { variantId: number }) {
 *   const { startUpload, isUploading } = useUploadThing('variantImage')
 *
 *   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const files = Array.from(e.target.files ?? [])
 *     const result = await startUpload(files)
 *     if (result) {
 *       console.log('آپلود شد:', result)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <input type="file" multiple accept="image/*" onChange={handleChange} />
 *       {isUploading && <p>در حال آپلود...</p>}
 *     </div>
 *   )
 * }
 */