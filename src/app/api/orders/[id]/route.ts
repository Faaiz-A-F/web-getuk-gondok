import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH — update order status / paymentStatus (used by QRIS payment flow)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentStatus, status } = body as {
      paymentStatus?: "UNPAID" | "PAID";
      status?: "PENDING" | "PAID" | "DONE" | "CANCELLED";
    };

    const data: { paymentStatus?: PaymentStatus; status?: OrderStatus } = {};
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (status) data.status = status;

    const order = await prisma.order.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
