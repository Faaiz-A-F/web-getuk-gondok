import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Handle login/register
  return NextResponse.json({ message: "Auth endpoint" });
}
