import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const guideId = params.id;

    if (!guideId) {
      return NextResponse.json(
        { error: "Guide ID is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: guideId, // userId in Review represents the guide's ID
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        tour: {
          select: {
            title: true,
          },
        },
        reviewerId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch reviewer names in a separate query since we don't have a direct relation
    const reviewsWithReviewerNames = await Promise.all(
      reviews.map(async (review) => {
        if (!review.reviewerId) return review;
        
        const reviewer = await prisma.user.findUnique({
          where: { id: review.reviewerId },
          select: { name: true },
        });
        
        return {
          ...review,
          reviewerName: reviewer?.name || 'Unknown User',
        };
      })
    );

    return NextResponse.json(reviewsWithReviewerNames);
  } catch (error) {
    console.error("Error fetching guide reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
} 