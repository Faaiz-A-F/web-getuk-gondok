import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, validateSession, refreshSession, type SessionUser } from './lib/session'

// This disables Edge Runtime and forces Node.js runtime for middleware
// This is needed because Prisma with MySQL doesn't work well in Edge Runtime
export const runtime = 'nodejs'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/catalogue',
  '/about-us',
  '/api/auth', // Allow auth API calls
  '/api/products', // Allow product API calls (for catalogue)
  '/api/categories', // Allow categories API calls
  '/api/reviews', // Allow reviews API calls
  '/_next',
  '/favicon.ico',
  '/public',
]

// Paths that require admin access
const adminPaths = [
  '/admin',
  '/api/admin',
]

// Check if a path is public
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )
}

// Check if a path requires admin access
function isAdminPath(pathname: string): boolean {
  return adminPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Get the session cookie
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value

  // Validate the session (only if sessionId exists)
  const user = sessionId ? await validateSession(sessionId) : null

  // If no valid session, redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    // Add redirect parameter to come back after login
    loginUrl.searchParams.set('redirect', pathname)
    
    const response = NextResponse.redirect(loginUrl)
    
    // Clear the expired/invalid session cookie if it exists
    if (sessionId) {
      response.cookies.delete(SESSION_COOKIE_NAME)
    }
    
    return response
  }

  // Check if admin path requires admin role
  if (isAdminPath(pathname) && user.role !== 'ADMIN') {
    // Redirect non-admins away from admin pages
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  // Session is valid - create response with refreshed session
  const response = NextResponse.next()

  // Set user info in headers for server components to access
  response.headers.set('x-user-id', user.id)
  response.headers.set('x-user-role', user.role)
  response.headers.set('x-user-email', user.email)

  // Only refresh and set cookie if sessionId exists
  if (sessionId) {
    // Refresh the session cookie (update lastActivity)
    await refreshSession(sessionId)

    // Set a new cookie with updated maxAge
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
  }

  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
