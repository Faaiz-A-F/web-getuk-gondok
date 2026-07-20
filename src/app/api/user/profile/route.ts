import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const userId = auth.user.id;
    const [dbUser, setting] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, phone: true, address: true, role: true } }),
      prisma.userSetting.upsert({ where: { userId }, update: {}, create: { userId, settings: {} } }),
    ]);
    if (!dbUser) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    const settings = (setting.settings as Record<string, unknown>) || {};
    return NextResponse.json({ ...dbUser, phone: dbUser.phone ?? "", address: dbUser.address ?? "", dob: typeof settings.dob === "string" ? settings.dob : "" });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Gagal memuat profil" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const body = await request.json();
    const combinedName = [body.firstName, body.lastName].filter((value) => typeof value === "string" && value.trim()).join(" ").trim() || auth.user.name;
    const updatedUser = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        name: combinedName.slice(0, 120),
        phone: typeof body.phone === "string" ? body.phone.trim().slice(0, 30) || null : null,
        address: typeof body.address === "string" ? body.address.trim().slice(0, 1000) || null : null,
      },
      select: { id: true, name: true, email: true, phone: true, address: true, role: true },
    });
    const existing = await prisma.userSetting.upsert({ where: { userId: auth.user.id }, update: {}, create: { userId: auth.user.id, settings: {} } });
    const current = (existing.settings as Record<string, unknown>) || {};
    const updatedSettings = await prisma.userSetting.update({
      where: { userId: auth.user.id },
      data: { settings: { ...current, dob: typeof body.dob === "string" ? body.dob.slice(0, 10) : "" } },
    });
    return NextResponse.json({ success: true, user: updatedUser, settings: updatedSettings.settings });
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
