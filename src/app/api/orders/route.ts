import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // GET all orders
  return NextResponse.json({ message: "Get orders" });
}

export async function POST(request: NextRequest) {
  // Create new order
  return NextResponse.json({ message: "Create order" });
}
