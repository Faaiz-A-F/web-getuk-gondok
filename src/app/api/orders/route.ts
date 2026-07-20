import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

interface RequestedItem {
  productId: string;
  quantity: number;
  note?: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const requestedUserId = request.nextUrl.searchParams.get("userId");
    const userId = auth.user.role === "ADMIN" ? requestedUserId || undefined : auth.user.id;
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: { include: { product: { select: { name: true } } } },
        user: { select: { name: true, email: true, phone: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Gagal memuat pesanan" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const items = body.items as RequestedItem[];
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Keranjang tidak boleh kosong" }, { status: 400 });
    }
    if (items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return NextResponse.json({ error: "Data item pesanan tidak valid" }, { status: 400 });
    }

    const uniqueIds = [...new Set(items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: uniqueIds }, isActive: true },
      select: { id: true, price: true, stock: true },
    });
    if (products.length !== uniqueIds.length) {
      return NextResponse.json({ error: "Satu atau beberapa produk tidak tersedia" }, { status: 400 });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (item.quantity > product.stock) {
        return NextResponse.json({ error: "Jumlah pesanan melebihi stok yang tersedia" }, { status: 400 });
      }
    }

    const preparationDate = body.preparationDate ? new Date(body.preparationDate) : null;
    if (!preparationDate || Number.isNaN(preparationDate.getTime())) {
      return NextResponse.json({ error: "Tanggal pengambilan wajib diisi" }, { status: 400 });
    }

    const adminFee = 2000;
    const subtotal = items.reduce((sum, item) => {
      const price = Number(productMap.get(item.productId)!.price);
      return sum + price * item.quantity;
    }, 0);
    const orderNumber = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          totalAmount: subtotal + adminFee,
          shippingCost: adminFee,
          shippingAddress: "Pickup Order",
          notes: typeof body.notes === "string" ? body.notes.trim() || null : null,
          paymentStatus: "UNPAID",
          status: "PENDING",
          pickupLocation: body.pickupLocation === "toko" ? "toko" : "rumah-produksi",
          preparationDate,
          userId: auth.user.id,
          items: {
            create: items.map((item) => {
              const price = Number(productMap.get(item.productId)!.price);
              return {
                productId: item.productId,
                quantity: item.quantity,
                price,
                subtotal: price * item.quantity,
                note: typeof item.note === "string" ? item.note.trim() || null : null,
              };
            }),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      }
      return created;
    });

    return NextResponse.json({ success: true, orderId: order.id, order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Gagal membuat pesanan" }, { status: 500 });
  }
}
