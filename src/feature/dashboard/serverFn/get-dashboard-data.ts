import { staffMiddleware } from '@/feature/auth/Middleware/auth'
import { getDb } from '@/server/db'
import { createServerFn } from '@tanstack/react-start'

export const getDashboardData = createServerFn()
  .middleware([staffMiddleware])
  .handler(async () => {
    const db = getDb()

    const [products, variants, orders, inquiries, users] = await Promise.all([
      db.query.products.findMany({ with: { variants: true } }),
      db.query.productVariants.findMany(),
      db.query.orders.findMany({
        with: { user: true, items: true },
        orderBy: (o, { desc }) => [desc(o.createdAt)],
      }),
      db.query.inquiries.findMany({
        with: { user: true, product: true, variant: true },
        orderBy: (i, { desc }) => [desc(i.createdAt)],
      }),
      db.query.users.findMany({
        orderBy: (u, { desc }) => [desc(u.createdAt)],
      }),
    ])

    const today = new Date()
    const isToday = (date: Date) =>
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()

    return {
      stats: {
        products: products.length,
        activeVariants: variants.filter((v) => v.isActive).length,
        todayOrders: orders.filter((o) => isToday(new Date(o.createdAt)))
          .length,
        newInquiries: inquiries.filter((i) => i.status === 'new').length,
      },
      orders: orders.map((o) => ({
        id: o.id,
        customerName: o.user?.name || o.user?.phone || '—',
        phone: o.user?.phone || '—',
        totalAmount: o.totalAmount,
        status: o.status,
        itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: o.createdAt,
      })),
      inquiries: inquiries.map((i) => ({
        id: i.id,
        customerName: i.user?.name || i.user?.phone || '—',
        phone: i.user?.phone || '—',
        message: i.message,
        productName: i.product?.name || null,
        variant: i.variant
          ? `${i.variant.dimension} / ${i.variant.color}`
          : null,
        status: i.status,
        createdAt: i.createdAt,
      })),
      users: users.map(
        ({ passwordHash: _passwordHash, otpCode: _otpCode, ...u }) => u,
      ),
    }
  })
