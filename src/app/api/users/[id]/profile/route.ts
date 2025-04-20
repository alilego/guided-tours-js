import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user basic info and calculate stats in parallel
    const [user, reviews, completedTours] = await Promise.all([
      // Get user basic info
      prisma.user.findUnique({
        where: { id: params.id },
        select: {
          name: true,
          image: true,
        },
      }),

      // Get all reviews for calculating average rating
      prisma.review.findMany({
        where: {
          userId: params.id, // Reviews where this user was the guide
        },
        select: {
          rating: true,
        },
      }),

      // Get completed tours with more than 1 participant
      prisma.tour.findMany({
        where: {
          creatorId: params.id,
          date: {
            lt: new Date(), // Only past tours
          },
        },
        include: {
          bookings: true,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Guide not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    let averageRating = null;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Number((totalRating / reviews.length).toFixed(1));
    }

    // Calculate number of successful tours (tours with more than 1 participant)
    const successfulTours = completedTours.filter(
      tour => tour.bookings.length > 1
    );

    return NextResponse.json({
      name: user.name,
      image: user.image,
      stats: {
        averageRating,
        totalReviews: reviews.length,
        successfulTours: successfulTours.length,
        totalCompletedTours: completedTours.length,
      },
    });
  } catch (error) {
    console.error("Error fetching guide profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide profile" },
      { status: 500 }
    );
  }
} 