import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// GET /api/reviews/can-review?userId=...&productId=...
// Returns: { canReview, orders: [{id, orderNumber}] } — DONE orders containing the product
export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { searchParams } = new URL(request.url);
    const userId = auth.user.id;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
        status: "DONE",
        items: { some: { productId } },
      },
      select: { id: true, orderNumber: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    // Find which orders have already been reviewed
    const existingReviews = await prisma.review.findMany({
      where: {
        userId,
        productId,
        orderId: { in: orders.map((o) => o.id) },
      },
      select: { orderId: true },
    });
    const reviewedOrderIds = new Set(existingReviews.map((r) => r.orderId));

    const reviewableOrders = orders
      .filter((o) => !reviewedOrderIds.has(o.id))
      .map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt,
      }));

    return NextResponse.json({
      canReview: reviewableOrders.length > 0,
      orders: reviewableOrders,
    });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
