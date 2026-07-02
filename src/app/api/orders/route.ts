import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // GET all orders
  return NextResponse.json({ message: "Get orders" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, items, subtotal, adminFee, totalAmount, pickupLocation, userId } = body;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: totalAmount,
        shippingCost: 0,
        shippingAddress: pickupLocation,
        paymentStatus: "UNPAID",
        status: "PENDING",
        userId: userId || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, orderId: order.id, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
