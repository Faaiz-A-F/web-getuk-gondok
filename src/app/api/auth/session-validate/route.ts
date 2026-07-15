import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from 'jose'

// Session configuration
const SESSION_COOKIE_NAME = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

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

// Validate JWT
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

// Create new JWT
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

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ valid: false })
    }

    // Validate the JWT
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
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ valid: false })
  }
}
