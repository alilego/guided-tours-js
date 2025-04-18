import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Booking } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tourId, participants } = body;

    if (!tourId || !participants || participants < 1) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get the tour to check availability
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { bookings: true },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Calculate available spots
    const bookedSpots = tour.bookings.reduce((total: number, booking) => {
      return total + 1; // Each booking counts as 1 spot
    }, 0);
    const availableSpots = tour.maxParticipants - bookedSpots;

    if (participants > availableSpots) {
      return NextResponse.json(
        { error: 'Not enough spots available' },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        tourId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tour: {
          include: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 