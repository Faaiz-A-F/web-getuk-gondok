import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: { include: { images: true } } } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const { status } = await request.json()
  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Allow any status change (admin can always modify order status)
  const validStatuses = ['PENDING', 'PAID', 'DONE', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ 
      error: `Invalid status: ${status}` 
    }, { status: 400 })
  }

  // When status changes to PAID, also update paymentStatus
  const updateData: any = { status }
  if (status === 'PAID') {
    updateData.paymentStatus = 'PAID'
  }

  const [updated] = await prisma.$transaction([
    prisma.order.update({ where: { id }, data: updateData }),
    prisma.adminLog.create({
      data: {
        action: 'UPDATE_STATUS',
        entity: 'Order',
        entityId: id,
        metadata: { from: existing.status, to: status },
        userId: auth.user.id,
        orderId: id,
      },
    }),
  ])

  return NextResponse.json(updated)
}
