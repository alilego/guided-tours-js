import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { TourUpdateInput } from '@/types/tour';

interface TourWithCreatorId extends TourUpdateInput {
  id: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
    }) as TourWithCreatorId;

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Get bookings count
    const bookingsCount = await prisma.booking.count({
      where: { tourId: params.id },
    });

    // Get creator info
    const creator = await prisma.user.findUnique({
      where: { id: tour.creatorId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    // Combine the data
    const tourData = {
      ...tour,
      bookingsCount,
      creator,
    };

    return NextResponse.json(tourData);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
    }) as TourWithCreatorId;

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Ensure the user owns this tour
    if (tour.creatorId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json() as TourUpdateInput;

    const updatedTour = await prisma.tour.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
        date: data.date ? new Date(data.date) : undefined,
        maxParticipants: data.maxParticipants,
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
    }) as TourWithCreatorId;

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Ensure the user owns this tour
    if (tour.creatorId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.tour.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour' },
      { status: 500 }
    );
  }
} 