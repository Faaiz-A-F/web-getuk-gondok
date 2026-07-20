import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const SESSION_COOKIE_NAME = 'session';

interface SessionPayload {
  user?: { id: string; email: string; name: string; role: string };
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }
  return new TextEncoder().encode(secret || 'your-super-secret-key-change-in-production');
}

export async function requireUser(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return { error: 'Unauthorized', status: 401 } as const;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const session = payload as SessionPayload;
    if (!session.user?.id) return { error: 'Unauthorized', status: 401 } as const;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: 'Unauthorized', status: 401 } as const;

    return { user, id: user.id };
  } catch {
    return { error: 'Unauthorized', status: 401 } as const;
  }
}

export async function requireAdmin(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return auth;
  if (auth.user.role !== 'ADMIN') return { error: 'Forbidden', status: 403 } as const;
  return auth;
}
