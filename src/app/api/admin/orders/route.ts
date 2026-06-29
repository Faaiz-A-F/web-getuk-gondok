import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const status = searchParams.get('status') ?? undefined
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')

  const where = {
    ...(status && { status: status as any }),
    ...(dateFrom || dateTo ? {
      createdAt: {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      }
    } : {}),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true } } }
        }
      },
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ 
    orders: orders.map(o => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      shippingCost: Number(o.shippingCost),
      items: o.items.map(i => ({
        ...i,
        price: Number(i.price),
        subtotal: Number(i.subtotal),
      }))
    })),
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  })
}
