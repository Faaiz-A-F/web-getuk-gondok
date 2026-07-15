import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
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

// Session data in JWT
interface SessionData {
  user: SessionUser
  exp: number
}

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/catalogue',
  '/about-us',
  '/api/auth',
  '/api/products',
  '/api/categories',
  '/api/reviews',
  '/_next',
  '/favicon.ico',
  '/public',
]

// Paths that require admin access
const adminPaths = [
  '/admin',
  '/api/admin',
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )
}

function isAdminPath(pathname: string): boolean {
  return adminPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )
}

// JWT validation (works in Edge Runtime!)
async function validateJWT(token: string): Promise<SessionUser | null> {
  if (!token) return null
  
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    
    const sessionData = payload as unknown as SessionData
    
    // Check expiration
    if (!sessionData.exp || sessionData.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return sessionData.user
  } catch {
    return null
  }
}

// Refresh JWT (creates new token with extended expiration)
async function refreshJWT(token: string): Promise<string | null> {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    const sessionData = payload as unknown as SessionData
    
    // Create new token with fresh expiration
    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
    
    return await new SignJWT({ user: sessionData.user })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .setJti(crypto.randomUUID())
      .sign(secret)
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Get the session cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

  // Validate the JWT token
  const user = sessionToken ? await validateJWT(sessionToken) : null

  // If no valid session, redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    const response = NextResponse.redirect(loginUrl)
    
    // Clear the expired/invalid session cookie if it exists
    if (sessionToken) {
      response.cookies.delete(SESSION_COOKIE_NAME)
    }
    
    return response
  }

  // Check if admin path requires admin role
  if (isAdminPath(pathname) && user.role !== 'ADMIN') {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  // Session is valid - create response
  const response = NextResponse.next()

  // Set user info in headers for server components
  response.headers.set('x-user-id', user.id)
  response.headers.set('x-user-role', user.role)
  response.headers.set('x-user-email', user.email)

  // Refresh the JWT on each request (extend expiration)
  if (sessionToken) {
    const newToken = await refreshJWT(sessionToken)
    if (newToken) {
      response.cookies.set(SESSION_COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
