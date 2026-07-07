import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let orders;
    
    if (userId) {
      // Get orders for specific user
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Get all orders (for admin)
      orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, items, subtotal, adminFee, totalAmount, pickupLocation, userId, notes } = body;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: totalAmount,
        shippingCost: 0,
        shippingAddress: pickupLocation,
        notes: notes || null,
        paymentStatus: "UNPAID",
        status: "PENDING",
        userId: userId || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
            note: item.note || null,
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
