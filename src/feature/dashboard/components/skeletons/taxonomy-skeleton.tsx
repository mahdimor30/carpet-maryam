export function TaxonomySkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-64 rounded-lg bg-muted" />
      </div>

      <div className="mb-6 flex gap-2">
        <div className="h-10 w-36 rounded-xl bg-muted" />
        <div className="h-10 w-36 rounded-xl bg-muted" />
        <div className="h-10 w-36 rounded-xl bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-4 h-5 w-24 rounded-lg bg-muted" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-6 w-6 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
