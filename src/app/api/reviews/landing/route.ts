import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get reviews selected for landing page
export async function GET(request: NextRequest) {
  try {
    // Get the selected review IDs from site content
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

    // If no reviews selected, return empty
    if (selectedReviewIds.length === 0) {
      return NextResponse.json({ reviews: [] });
    }

    // Fetch the selected reviews with user info
    const reviews = await prisma.review.findMany({
      where: { id: { in: selectedReviewIds } },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Maintain the order specified by selectedReviewIds
    const orderedReviews = selectedReviewIds
      .map((id) => reviews.find((r) => r.id === id))
      .filter(Boolean);

    return NextResponse.json({ reviews: orderedReviews });
  } catch (error) {
    console.error("Error fetching landing reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch landing reviews" },
      { status: 500 }
    );
  }
}
