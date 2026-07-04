
import { useState } from 'react'
import { Heart, Plus, Star } from 'lucide-react'
import { type Product, formatPrice, toFaNumber } from '@/lib/data'
import { useCart } from './cart-provider'
import { Link } from '@tanstack/react-router'

const TAG_STYLES: Record<string, string> = {
  پرفروش: 'bg-accent text-accent-foreground',
  جدید: 'bg-primary text-primary-foreground',
  ویژه: 'bg-primary text-primary-foreground',
}

function tagStyle(tag: string) {
  if (tag.includes('تخفیف')) return 'bg-destructive text-primary-foreground'
  return TAG_STYLES[tag] ?? 'bg-secondary text-secondary-foreground'
}

export function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false)
  const { add } = useCart()

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden bg-secondary"
      >
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${tagStyle(
              product.tag,
            )}`}
          >
            {product.tag}
          </span>
        )}
      </Link>

      <button
        onClick={() => setWished((v) => !v)}
        aria-label="افزودن به علاقه‌مندی"
        className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-transform hover:scale-110"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            wished ? 'fill-destructive text-destructive' : 'text-foreground/50'
          }`}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link to="/products/$slug" params={{ slug: product.slug }}>
              <h3 className="text-sm font-semibold text-foreground transition-colors hover:text-accent">
                {product.name}
              </h3>
            </Link>
            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {toFaNumber(product.rating)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            ابعاد {product.size} متر
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
              <span className="mr-1 text-xs font-normal text-muted-foreground">
                تومان
              </span>
            </p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            onClick={() => add(product)}
            aria-label="افزودن به سبد"
            className="flex h-9 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            افزودن
          </button>
        </div>
      </div>
    </div>
  )
}
