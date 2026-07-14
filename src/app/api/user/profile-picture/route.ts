import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — fetch current profile picture for a user
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const setting = await prisma.userSetting.upsert({
      where: { userId },
      update: {},
      create: { userId, settings: {} },
    });

    const settings = (setting.settings as Record<string, any>) || {};
    return NextResponse.json({ profilePicture: settings.profilePicture ?? null });
  } catch (err) {
    console.error("GET profile-picture error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — save base64-encoded image to user settings
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, image } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // Limit raw payload size (~5MB base64)
    if (image.length > 7 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const existing = await prisma.userSetting.upsert({
      where: { userId },
      update: {},
      create: { userId, settings: {} },
    });

    const current = (existing.settings as Record<string, any>) || {};
    const updated = await prisma.userSetting.update({
      where: { userId },
      data: { settings: { ...current, profilePicture: image } },
    });

    return NextResponse.json({ success: true, settings: updated.settings });
  } catch (err) {
    console.error("POST profile-picture error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
