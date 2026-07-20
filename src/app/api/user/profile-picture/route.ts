import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const setting = await prisma.userSetting.upsert({ where: { userId: auth.user.id }, update: {}, create: { userId: auth.user.id, settings: {} } });
    const settings = (setting.settings as Record<string, unknown>) || {};
    return NextResponse.json({ profilePicture: typeof settings.profilePicture === "string" ? settings.profilePicture : null });
  } catch (error) {
    console.error("GET profile-picture error:", error);
    return NextResponse.json({ error: "Gagal memuat foto profil" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { image } = await request.json();
    if (typeof image !== "string" || !/^data:image\/(jpeg|png|webp);base64,/i.test(image)) {
      return NextResponse.json({ error: "Format gambar tidak valid" }, { status: 400 });
    }
    if (image.length > 7 * 1024 * 1024) return NextResponse.json({ error: "Ukuran gambar terlalu besar" }, { status: 413 });
    const existing = await prisma.userSetting.upsert({ where: { userId: auth.user.id }, update: {}, create: { userId: auth.user.id, settings: {} } });
    const current = (existing.settings as Record<string, unknown>) || {};
    const updated = await prisma.userSetting.update({ where: { userId: auth.user.id }, data: { settings: { ...current, profilePicture: image } } });
    return NextResponse.json({ success: true, settings: updated.settings });
  } catch (error) {
    console.error("POST profile-picture error:", error);
    return NextResponse.json({ error: "Gagal menyimpan foto profil" }, { status: 500 });
  }
}
