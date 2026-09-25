const STATUS: Record<string, string> = {
  new: 'جدید',
  contacted: 'تماس گرفته شد',
  closed: 'بسته',
}
export function InquiriesPage({
  inquiries,
}: {
  inquiries: Array<{
    id: number
    customerName: string
    phone: string
    message: string
    productName: string | null
    variant: string | null
    status: string
    createdAt: Date
  }>
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-heading text-2xl font-bold">استعلام‌ها</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        درخواست‌ها و پیام‌های مشتریان
      </p>
      <div className="space-y-3">
        {inquiries.length ? (
          inquiries.map((i) => (
            <article
              key={i.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{i.customerName}</div>
                  <div className="text-xs text-muted-foreground" dir="ltr">
                    {i.phone}
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                  {STATUS[i.status] || i.status}
                </span>
              </div>
              {(i.productName || i.variant) && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {i.productName}
                  {i.variant ? ` — ${i.variant}` : ''}
                </p>
              )}
              <p className="mt-2 text-sm leading-7">{i.message}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(i.createdAt).toLocaleString('fa-IR')}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            استعلامی وجود ندارد.
          </div>
        )}
      </div>
    </div>
  )
}
