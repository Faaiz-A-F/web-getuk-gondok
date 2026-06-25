import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const [totalOrders, totalCustomers, totalProducts, paidOrders, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({ where: { paymentStatus: 'PAID' }, select: { totalAmount: true, createdAt: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
  ])

  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0)

  const revenueByMonth: Record<string, number> = {}
  const now = new Date()
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
  })
}
