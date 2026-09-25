import { formatToman, toFa } from '@/lib/dashboard-data'

const STATUS: Record<string, string> = {
  pending: 'در انتظار', confirmed: 'تأیید شده', sourcing: 'تأمین', quality_check: 'کنترل کیفیت', shipped: 'ارسال شده', delivered: 'تحویل شده', cancelled: 'لغو شده',
}

export function OrdersPage({ orders }: { orders: Array<{ id:number; customerName:string; phone:string; totalAmount:number; status:string; itemCount:number; createdAt:Date }> }) {
  return <div className="mx-auto max-w-6xl"><h1 className="font-heading text-2xl font-bold">سفارش‌ها</h1><p className="mt-1 mb-6 text-sm text-muted-foreground">مدیریت و پیگیری سفارش‌های ثبت‌شده</p>
    <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-right"><thead><tr className="border-b bg-secondary/50 text-xs text-muted-foreground"><th className="px-4 py-3">شماره</th><th className="px-4 py-3">مشتری</th><th className="px-4 py-3">تعداد</th><th className="px-4 py-3">مبلغ</th><th className="px-4 py-3">وضعیت</th><th className="px-4 py-3">تاریخ</th></tr></thead><tbody>
      {orders.length ? orders.map(o => <tr key={o.id} className="border-b border-border/60 text-sm last:border-0"><td className="px-4 py-3 font-medium">#{toFa(o.id)}</td><td className="px-4 py-3"><div>{o.customerName}</div><div className="text-xs text-muted-foreground" dir="ltr">{o.phone}</div></td><td className="px-4 py-3">{toFa(o.itemCount)}</td><td className="px-4 py-3">{formatToman(o.totalAmount)} تومان</td><td className="px-4 py-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{STATUS[o.status] || o.status}</span></td><td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</td></tr>) : <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">هنوز سفارشی ثبت نشده است.</td></tr>}
    </tbody></table></div></div></div>
}
