import { prisma } from './prisma'
import { SignJWT, jwtVerify } from 'jose'

// Session configuration
export const SESSION_COOKIE_NAME = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

// JWT Secret - in production, use environment variable
const getSecret = () => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
  return new TextEncoder().encode(secret)
}

// User type for session
export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  phone?: string | null
}

// Session data stored in JWT
interface SessionData {
  user: SessionUser
  exp: number
}

/**
 * Creates a JWT token for the user
 */
export async function createSession(user: SessionUser): Promise<string> {
  const secret = getSecret()
  
  // Calculate expiration time (24 hours from now)
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .setJti(crypto.randomUUID()) // Unique session ID
    .sign(secret)
  
  // Also store in database for potential invalidation
  await prisma.session.create({
    data: {
      id: token.substring(0, 36), // Use first part as ID for lookup
      userId: user.id,
      data: JSON.stringify(user),
      expiresAt: new Date(expiresAt * 1000),
    }
  }).catch(() => {
    // Ignore if table doesn't exist yet
  })
  
  return token
}

/**
 * Validates a JWT token and returns the user
 */
export async function validateSession(token: string): Promise<SessionUser | null> {
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
  } catch (error) {
    // Token is invalid or expired
    return null
  }
}

/**
 * Refreshes session by creating a new token
 */
export async function refreshSession(token: string): Promise<string | null> {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    const sessionData = payload as unknown as SessionData
    
    // Create new token with fresh expiration
    return await createSession(sessionData.user)
  } catch {
    return null
  }
}

/**
 * Destroys a session (logout) - mark as invalid in database
 */
export async function destroySession(token: string): Promise<void> {
  try {
    const sessionId = token.substring(0, 36)
    await prisma.session.delete({
      where: { id: sessionId }
    }).catch(() => {})
  } catch {
    // Ignore errors
  }
}

/**
 * Validates session for Node.js runtime (API routes)
 * Uses database for stronger validation
 */
export async function validateSessionNode(token: string): Promise<SessionUser | null> {
  if (!token) return null
  
  try {
    // First validate JWT
    const user = await validateSession(token)
    if (!user) return null
    
    // Also check database for immediate invalidation capability
    const sessionId = token.substring(0, 36)
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    })
    
    if (!session) return null
    
    // Check if expired
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({
        where: { id: sessionId }
      }).catch(() => {})
      return null
    }
    
    return user
  } catch (error) {
    // Fall back to JWT-only validation
    return validateSession(token)
  }
}
