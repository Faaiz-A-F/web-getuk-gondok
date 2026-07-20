import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const setting = await prisma.userSetting.upsert({ where: { userId: auth.user.id }, update: {}, create: { userId: auth.user.id, settings: {} } });
    return NextResponse.json(setting);
  } catch (error) {
    console.error('GET user settings error:', error);
    return NextResponse.json({ error: 'Gagal memuat pengaturan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = await request.json();
    const settings = body.settings && typeof body.settings === 'object' && !Array.isArray(body.settings) ? body.settings : {};
    const updated = await prisma.userSetting.upsert({ where: { userId: auth.user.id }, update: { settings }, create: { userId: auth.user.id, settings } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('POST user settings error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}
