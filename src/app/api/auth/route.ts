import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, destroySession, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, phone, address, sessionId } = await request.json()

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

      // Create session
      const newSessionId = await createSession({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      })

      // Create response with user data and set session cookie
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
        sessionId: newSessionId, // Return session ID for client-side use
        message: 'Login successful'
      })

      // Set the session cookie
      response.cookies.set(SESSION_COOKIE_NAME, newSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      })

      return response
    }

    if (action === 'logout') {
      // Validate session ID
      if (!sessionId) {
        return NextResponse.json(
          { error: 'Session ID is required' },
          { status: 400 }
        )
      }

      // Destroy the session
      await destroySession(sessionId)

      // Create response and clear the session cookie
      const response = NextResponse.json({
        message: 'Logout successful'
      })

      // Clear the session cookie
      response.cookies.delete(SESSION_COOKIE_NAME)

      return response
    }

    if (action === 'validate') {
      // This endpoint is used to validate and refresh session from client
      if (!sessionId) {
        return NextResponse.json(
          { valid: false },
          { status: 200 }
        )
      }

      // Import validateSession dynamically to avoid circular imports
      const { validateSession } = await import('@/lib/session')
      const user = await validateSession(sessionId)

      if (!user) {
        const response = NextResponse.json({ valid: false })
        response.cookies.delete(SESSION_COOKIE_NAME)
        return response
      }

      // Refresh session
      const { refreshSession } = await import('@/lib/session')
      await refreshSession(sessionId)

      const response = NextResponse.json({
        valid: true,
        user
      })

      // Set updated cookie
      response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "login", "register", "logout", or "validate"' },
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
