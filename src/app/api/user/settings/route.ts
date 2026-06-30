import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Use an upsert so we find or create in a single atomic database operation
    const setting = await prisma.userSetting.upsert({
      where: { userId },
      update: {}, // If found, do nothing
      create: { 
        userId, 
        settings: {} // Empty JSON object as default
      }
    })

    return NextResponse.json(setting)
  } catch (err) {
    console.error("GET user settings error:", err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, settings } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Ensure the payload falls back to an empty object, handled cleanly as Prisma JSON input
    const jsonSettings = settings ?? {}

    // Atomic Upsert: Replaces the manual check-then-create/update logic
    const updatedSetting = await prisma.userSetting.upsert({
      where: { userId },
      update: { 
        settings: jsonSettings 
      },
      create: { 
        userId, 
        settings: jsonSettings 
      }
    })

    return NextResponse.json(updatedSetting)
  } catch (err) {
    console.error("POST user settings error:", err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}