import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // GET all products
  return NextResponse.json({ message: "Get products" });
}

export async function POST(request: NextRequest) {
  // Create new product
  return NextResponse.json({ message: "Create product" });
}
