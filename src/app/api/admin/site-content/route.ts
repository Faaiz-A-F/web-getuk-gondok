import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const contents = await prisma.siteContent.findMany({ orderBy: { section: 'asc' } })

  const grouped = contents.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {} as Record<string, typeof contents>)

  return NextResponse.json(grouped)
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { key, value } = await request.json()
  if (!key || value === undefined) return NextResponse.json({ error: 'key and value required' }, { status: 400 })

  const updated = await prisma.siteContent.update({
    where: { key },
    data: { value, updatedById: auth.user.id },
  })

  return NextResponse.json(updated)
}
