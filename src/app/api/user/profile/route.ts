import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — fetch full profile (User + UserSetting)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [dbUser, setting] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true, role: true },
      }),
      prisma.userSetting.upsert({
        where: { userId },
        update: {},
        create: { userId, settings: {} },
      }),
    ]);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const settings = (setting.settings as Record<string, any>) || {};
    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone ?? "",
      role: dbUser.role,
      dob: settings.dob ?? "",
      country: settings.country ?? "",
      city: settings.city ?? "",
      postal: settings.postal ?? "",
      location: settings.location ?? "",
    });
  } catch (err) {
    console.error("GET profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — update profile fields (name, phone on User; dob/country/city/postal/location on UserSetting)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, firstName, lastName, phone, dob, country, city, postal, location } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Combine first + last name into the User.name field
    const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim() || dbUser.name;

    // Update User table
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: combinedName,
        phone: phone ?? null,
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    // Update UserSetting.settings (merge so we don't lose profilePicture etc.)
    const existing = await prisma.userSetting.upsert({
      where: { userId },
      update: {},
      create: { userId, settings: {} },
    });
    const current = (existing.settings as Record<string, any>) || {};
    const updatedSettings = await prisma.userSetting.update({
      where: { userId },
      data: {
        settings: {
          ...current,
          dob: dob ?? "",
          country: country ?? "",
          city: city ?? "",
          postal: postal ?? "",
          location: location ?? [city, country].filter(Boolean).join(", "),
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      settings: updatedSettings.settings,
    });
  } catch (err) {
    console.error("PUT profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
