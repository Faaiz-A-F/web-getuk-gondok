import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const orderInclude = {
  items: { include: { product: true } },
  user: { select: { id: true, name: true, email: true, phone: true, address: true } },
} as const;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: { id, ...(auth.user.role === "ADMIN" ? {} : { userId: auth.user.id }) },
      include: orderInclude,
    });
    if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Gagal memuat pesanan" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireUser(request);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    const existing = await prisma.order.findFirst({
      where: { id, ...(auth.user.role === "ADMIN" ? {} : { userId: auth.user.id }) },
      select: { id: true },
    });
    if (!existing) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });

    const body = await request.json();
    const data: { paymentStatus?: PaymentStatus; status?: OrderStatus } = {};
    if (auth.user.role === "ADMIN") {
      if (Object.values(PaymentStatus).includes(body.paymentStatus)) data.paymentStatus = body.paymentStatus;
      if (Object.values(OrderStatus).includes(body.status)) data.status = body.status;
    } else if (body.paymentStatus === "PAID" && body.status === "PAID") {
      data.paymentStatus = PaymentStatus.PAID;
      data.status = OrderStatus.PAID;
    } else {
      return NextResponse.json({ error: "Perubahan status tidak diizinkan" }, { status: 403 });
    }

    if (Object.keys(data).length === 0) return NextResponse.json({ error: "Tidak ada data valid untuk diperbarui" }, { status: 400 });
    const order = await prisma.order.update({ where: { id }, data });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Gagal memperbarui pesanan" }, { status: 500 });
  }
}
