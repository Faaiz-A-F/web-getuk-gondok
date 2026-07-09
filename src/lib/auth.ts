import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 }
  }

  const userId = authHeader.replace('Bearer ', '')
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user || user.role !== 'ADMIN') {
    return { error: 'Forbidden', status: 403 }
  }

  return { user, id: user.id }
}
