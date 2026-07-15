import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all reviews for admin selection (no auth required for this internal use)
export async function GET(request: NextRequest) {
  try {
    // Get the currently selected review IDs
    const landingReviewsContent = await prisma.siteContent.findUnique({
      where: { key: "landing_reviews" },
    });

    let selectedReviewIds: string[] = [];
    if (landingReviewsContent?.value) {
      try {
        selectedReviewIds = JSON.parse(landingReviewsContent.value);
      } catch {
        selectedReviewIds = [];
      }
    }

    // Fetch all reviews with user and product info
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Add isSelected flag to each review
    const reviewsWithSelection = reviews.map((review) => ({
      ...review,
      isSelected: selectedReviewIds.includes(review.id),
    }));

    return NextResponse.json({ reviews: reviewsWithSelection });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PUT - Update selected reviews for landing page
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer ", "");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { reviewIds } = await request.json();

    if (!Array.isArray(reviewIds)) {
      return NextResponse.json(
        { error: "reviewIds must be an array" },
        { status: 400 }
      );
    }

    // Update or create the landing_reviews site content
    const content = await prisma.siteContent.upsert({
      where: { key: "landing_reviews" },
      update: {
        value: JSON.stringify(reviewIds),
        label: "Selected Reviews for Landing Page",
        section: "landing",
      },
      create: {
        key: "landing_reviews",
        value: JSON.stringify(reviewIds),
        label: "Selected Reviews for Landing Page",
        section: "landing",
        type: "JSON",
      },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating landing reviews:", error);
    return NextResponse.json(
      { error: "Failed to update landing reviews" },
      { status: 500 }
    );
  }
}
