import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const role = searchParams.get('role') ?? undefined
  const search = searchParams.get('search') ?? undefined

  const where = {
    ...(role && role !== 'ALL' && { role: role as 'ADMIN' | 'CUSTOMER' }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'asciicensitive' as const } },
        { email: { contains: search, mode: 'asciicensitive' as const } },
      ]
    }),
  }

  const [users, total, mainAdmin] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { orders: true }
        }
      },
    }),
    prisma.user.count({ where }),
    // Get the first admin (main admin who cannot be modified)
    prisma.user.findFirst({
      where: { role: 'ADMIN' },
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    }),
  ])

  return NextResponse.json({
    users: users.map(u => ({
      ...u,
      orderCount: u._count.orders,
      _count: undefined,
      isMainAdmin: mainAdmin?.id === u.id,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    mainAdminId: mainAdmin?.id,
  })
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const body = await request.json()
    const { email, password, name, phone, address, role } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!['ADMIN', 'CUSTOMER'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be ADMIN or CUSTOMER' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        address: address || null,
        role: role as 'ADMIN' | 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
