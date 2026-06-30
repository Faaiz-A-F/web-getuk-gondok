import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params

  try {
    const body = await request.json()
    const { name, phone, address, role, email } = body

    // Get main admin (first admin created)
    const mainAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    })

    // Check if trying to modify main admin
    if (mainAdmin?.id === id) {
      return NextResponse.json(
        { error: 'Cannot modify main admin account' },
        { status: 403 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If email is being changed, check if new email already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } })
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Validate role if being changed
    if (role && !['ADMIN', 'CUSTOMER'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be ADMIN or CUSTOMER' },
        { status: 400 }
      )
    }

    // Update user
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone || null
    if (address !== undefined) updateData.address = address || null
    if (role !== undefined) updateData.role = role
    if (email !== undefined) updateData.email = email

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params

  try {
    // Get main admin (first admin created)
    const mainAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    })

    // Check if trying to delete main admin
    if (mainAdmin?.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete main admin account' },
        { status: 403 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (cascades to orders if configured, otherwise handle separately)
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
