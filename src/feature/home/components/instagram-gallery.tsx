import { Camera, ExternalLink } from 'lucide-react'
import type { HomeProduct } from '@/feature/products/server/queries/get-home-products'

export function InstagramGallery({ products }: { products: HomeProduct[] }) {
  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            الهام بگیر
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            فرش‌های مریم در خانه مشتریان و طراحی‌های داخلی واقعی در سراسر
            ایران
          </p>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
        >
          <Camera className="h-4 w-4 text-accent" />
          <span dir="ltr">@farsh.maryam</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
          >
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded bg-foreground/60 px-2 py-1 text-xs font-medium text-primary-foreground">
                {product.design?.name ?? product.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
