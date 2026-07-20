import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { currentPassword, newPassword } = await request.json();
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'Kata sandi lama dan baru wajib diisi' }, { status: 400 });
    }
    if (newPassword.length < 6) return NextResponse.json({ error: 'Kata sandi baru minimal 6 karakter' }, { status: 400 });
    if (!(await bcrypt.compare(currentPassword, auth.user.password))) {
      return NextResponse.json({ error: 'Kata sandi saat ini tidak sesuai' }, { status: 401 });
    }
    await prisma.user.update({ where: { id: auth.user.id }, data: { password: await bcrypt.hash(newPassword, 12) } });
    return NextResponse.json({ message: 'Kata sandi berhasil diperbarui' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Gagal memperbarui kata sandi' }, { status: 500 });
  }
}
