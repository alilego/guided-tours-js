import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the tour exists and has available spots
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: { bookings: true },
    });

    if (!tour) {
      return new NextResponse('Tour not found', { status: 404 });
    }

    if (tour.bookings.length >= tour.maxParticipants) {
      return new NextResponse('Tour is fully booked', { status: 400 });
    }

    // Check if user has already booked this tour
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tourId: params.id,
        userId: session.user.id,
      },
    });

    if (existingBooking) {
      return new NextResponse('You have already booked this tour', { status: 400 });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        tourId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 