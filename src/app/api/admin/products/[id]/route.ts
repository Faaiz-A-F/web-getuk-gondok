import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  })

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await request.json()
  const { images, ...productData } = body

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(images && {
        images: {
          deleteMany: {},
          create: images,
        },
      }),
    },
    include: { images: true, category: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  })

  return NextResponse.json({ message: 'Product deactivated' })
}
