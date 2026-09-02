export function FormSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded-lg bg-muted" />
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 h-5 w-32 rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-xl bg-muted" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-24 w-full rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-xl bg-muted" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 h-5 w-40 rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-10 w-full rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-xl bg-muted" />
          <div className="h-10 w-28 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
