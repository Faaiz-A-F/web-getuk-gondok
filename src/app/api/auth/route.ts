import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

// Session configuration
export const SESSION_COOKIE_NAME = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

// JWT Secret
const getSecret = () => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
  return new TextEncoder().encode(secret)
}

// User type
interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  phone?: string | null
}

// Create JWT token
async function createJWT(user: SessionUser): Promise<string> {
  const secret = getSecret()
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .setJti(crypto.randomUUID())
    .sign(secret)
}

// Validate JWT token
async function validateJWT(token: string): Promise<SessionUser | null> {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    const sessionData = payload as unknown as { user: SessionUser; exp: number }
    if (!sessionData.exp || sessionData.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return sessionData.user
  } catch {
    return null
  }
}

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

      // Create JWT token
      const token = await createJWT({
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
        sessionId: token,
        message: 'Login successful'
      })

      // Set the session cookie
      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      })

      return response
    }

    if (action === 'logout') {
      // Just clear the cookie - JWT doesn't need server-side invalidation
      // (it will expire naturally)
      const response = NextResponse.json({
        message: 'Logout successful'
      })

      response.cookies.delete(SESSION_COOKIE_NAME)

      return response
    }

    if (action === 'validate') {
      // Validate existing session
      if (!sessionId) {
        return NextResponse.json({ valid: false })
      }

      const user = await validateJWT(sessionId)

      if (!user) {
        return NextResponse.json({ valid: false })
      }

      // Create new token with fresh expiration
      const newToken = await createJWT(user)

      const response = NextResponse.json({
        valid: true,
        user
      })

      // Set updated cookie
      response.cookies.set(SESSION_COOKIE_NAME, newToken, {
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
