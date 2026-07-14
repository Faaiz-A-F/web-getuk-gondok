import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET reviews — by productId (public) or by userId (private list)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");
    const all = searchParams.get("all");

    // Optional: return aggregate ratings for ALL products at once
    // Used by catalogue page to badge every product with its avg rating
    if (all === "true") {
      const groups = await prisma.review.groupBy({
        by: ["productId"],
        _avg: { rating: true },
        _count: { _all: true },
      });
      return NextResponse.json({ summary: groups });
    }

    if (productId) {
      const reviews = await prisma.review.findMany({
        where: { productId },
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      // Compute aggregate stats
      const total = reviews.length;
      const avg = total === 0
        ? 0
        : reviews.reduce((s, r) => s + r.rating, 0) / total;
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach((r) => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });

      return NextResponse.json({ reviews, stats: { total, avg, distribution } });
    }

    if (userId) {
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: { product: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ reviews });
    }

    return NextResponse.json({ reviews: [] });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST — create a new review (user must own a DONE order containing the product)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, orderId, rating, comment, photos, videoUrl } = body;

    if (!userId || !productId || !orderId) {
      return NextResponse.json(
        { error: "userId, productId, and orderId are required" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify the order belongs to the user, is DONE, and contains the product
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: "DONE",
        items: { some: { productId } },
      },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan, belum selesai, atau tidak berisi produk ini" },
        { status: 403 }
      );
    }

    // Block duplicate review for the same (user, product, order)
    const existing = await prisma.review.findFirst({
      where: { userId, productId, orderId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Anda sudah memberikan ulasan untuk produk ini dari pesanan tersebut" },
        { status: 409 }
      );
    }

    const cleanPhotos = Array.isArray(photos)
      ? photos
          .filter((p: unknown) => typeof p === "string" && (p as string).trim().length > 0)
          .slice(0, 6) // cap at 6 photos
      : [];

    const cleanVideo =
      typeof videoUrl === "string" && videoUrl.trim().length > 0
        ? videoUrl.trim().slice(0, 500)
        : null;

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        orderId,
        rating: ratingNum,
        comment: comment?.toString().trim().slice(0, 2000) || null,
        photos: cleanPhotos,
        videoUrl: cleanVideo,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
