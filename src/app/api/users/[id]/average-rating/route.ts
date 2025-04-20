import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get all reviews for the user
    const reviews = await prisma.review.findMany({
      where: {
        userId: params.id, // This targets the tour guide being reviewed
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return NextResponse.json({
        averageRating: null,
        totalReviews: 0,
      });
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return NextResponse.json({
      averageRating: Number(averageRating.toFixed(1)), // Round to 1 decimal place
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch average rating" },
      { status: 500 }
    );
  }
} 