import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export default function HeaderPage({
  backLink,
  title,
  description,
}: {
  backLink?: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link
          to={backLink ? backLink : '..'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground/70 transition-colors hover:bg-secondary"
          aria-label="بازگشت"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
