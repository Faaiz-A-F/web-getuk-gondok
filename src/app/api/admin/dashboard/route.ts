import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// Disable caching for this route
// export const dynamic = 'force-dynamic'
// export const revalidate = 0

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  // Get start of today in local timezone (Asia/Jakarta)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  const [
    totalOrders,
    totalCustomers,
    totalProducts,
    paidOrders,
    recentOrders,
    todayOrders,
    todayOrderItems,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({ where: { paymentStatus: 'PAID' }, select: { totalAmount: true, createdAt: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
    // Get today's orders (created today)
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
        paymentStatus: { in: ['PAID', 'UNPAID'] },
        status: { not: 'CANCELLED' },
      },
      include: {
        items: { select: { quantity: true } },
      },
    }),
    // Get today's order items for counting products sold
    prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
          paymentStatus: { in: ['PAID', 'UNPAID'] },
          status: { not: 'CANCELLED' },
        },
      },
    }),
  ])

  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)

  // Calculate today's stats
  const totalProductsSold = todayOrderItems.reduce((sum, item) => sum + item.quantity, 0)

  // For storeOrders and houseOrders, we count orders by their payment status
  // PAID = Store orders (sudah bayar, diambil di toko)
  // PENDING/UNPAID = House orders (pesanan rumah produksi yang belum lunas)
  const storeOrders = todayOrders.filter(o => o.paymentStatus === 'PAID').length
  const houseOrders = todayOrders.filter(o => o.paymentStatus === 'UNPAID').length

  const revenueByMonth: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('id-ID', { month: 'short', year: 'numeric' })
    revenueByMonth[key] = 0
  }
  for (const order of paidOrders) {
    const key = order.createdAt.toLocaleString('id-ID', { month: 'short', year: 'numeric' })
    if (key in revenueByMonth) revenueByMonth[key] += Number(order.totalAmount)
  }

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders: recentOrders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      userName: o.user.name,
      totalAmount: Number(o.totalAmount),
      status: o.status,
      createdAt: o.createdAt,
    })),
    revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })),
    // Today's stats calculation
    storeOrders,
    houseOrders,
    totalProductsSold,
  })
}
