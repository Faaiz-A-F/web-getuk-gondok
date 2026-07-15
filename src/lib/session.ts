import { prisma } from './prisma'

// Session configuration
export const SESSION_COOKIE_NAME = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

// User type for session
export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  phone?: string | null
}

/**
 * Creates a session for a user and stores it in database
 */
export async function createSession(user: SessionUser): Promise<string> {
  const sessionId = crypto.randomUUID()
  
  // Calculate expiration time (24 hours from now)
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)
  
  // Store session in database
  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      data: JSON.stringify(user),
      expiresAt: expiresAt,
    }
  })
  
  return sessionId
}

/**
 * Validates a session and returns the user if valid
 */
export async function validateSession(sessionId: string): Promise<SessionUser | null> {
  if (!sessionId) return null
  
  try {
    // Find the session in database
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    })
    
    if (!session) return null
    
    // Check if session has expired
    if (new Date() > session.expiresAt) {
      // Session expired - delete it
      await prisma.session.delete({
        where: { id: sessionId }
      }).catch(() => {}) // Ignore if already deleted
      return null
    }
    
    // Parse user data from session
    const user = JSON.parse(session.data) as SessionUser
    
    return user
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

/**
 * Refreshes session expiration time
 */
export async function refreshSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false
  
  try {
    // Update expiration time to 24 hours from now
    const newExpiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)
    
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: newExpiresAt }
    })
    
    return true
  } catch (error) {
    console.error('Session refresh error:', error)
    return false
  }
}

/**
 * Destroys a session (logout)
 */
export async function destroySession(sessionId: string): Promise<void> {
  try {
    await prisma.session.delete({
      where: { id: sessionId }
    })
  } catch {
    // Session might not exist, ignore error
  }
}

/**
 * Clean up expired sessions (call periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    return result.count
  } catch (error) {
    console.error('Session cleanup error:', error)
    return 0
  }
}
