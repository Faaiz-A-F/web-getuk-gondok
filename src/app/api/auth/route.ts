import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, phone, address } = await request.json()

    if (action === 'register') {
      // Validate required fields
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'Email, password, and name are required' },
          { status: 400 }
        )
      }

      // Validate phone - must start with +62
      if (phone && !phone.startsWith('+62')) {
        return NextResponse.json(
          { error: 'Phone number must start with +62' },
          { status: 400 }
        )
      }

      // Validate email - must be @gmail.com
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        return NextResponse.json(
          { error: 'Email must be a valid @gmail.com address' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          address: address || null,
          role: 'CUSTOMER',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        }
      })

      return NextResponse.json({ user, message: 'Registration successful' })
    }

    if (action === 'login') {
      // Validate required fields
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        )
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Return user data (in production, you would generate a JWT token here)
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        message: 'Login successful'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "login" or "register"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
