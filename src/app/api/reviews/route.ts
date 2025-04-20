import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to submit a review" },
        { status: 401 }
      );
    }

    // tourId is the ID of the tour being reviewed
    // userId is the tour guide's ID
    // reviewerId is the ID of the person submitting the review    
    // rating is the rating of the tour
    // comment is the review comment
    const { tourId, userId, rating, comment } = await request.json();

    // Validate required fields
    if (!tourId || !userId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get the tour to check its date and verify the tour guide
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    // Verify that the provided userId matches the tour guide's ID
    if (tour.creatorId !== userId) {
      return NextResponse.json(
        { error: "Invalid tour guide ID provided" },
        { status: 400 }
      );
    }

    // Check if tour date is in the past
    if (tour.date > new Date()) {
      return NextResponse.json(
        { error: "You can only review tours that have already taken place" },
        { status: 400 }
      );
    }

    // Check if user was registered for the tour
    const booking = await prisma.booking.findFirst({
      where: {
        tourId: tourId,
        userId: session.user.id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "You must have been registered for the tour to submit a review" },
        { status: 403 }
      );
    }

    // Check if user has already submitted a review for this tour
    const existingReview = await prisma.review.findFirst({
      where: {
        tourId: tourId,
        reviewerId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted a review for this tour" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        tourId,
        userId,  // Tour guide's ID
        reviewerId: session.user.id,  // ID of the person submitting the review
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
} 