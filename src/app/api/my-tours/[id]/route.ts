import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tour = await prisma.tour.findFirst({
      where: {
        id: params.id,
        creatorId: user.id,
      } as Prisma.TourWhereInput,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookings: true,
        Review: true,
      } as Prisma.TourInclude,
    });

    if (!tour) {
      return new NextResponse('Tour not found', { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First verify the tour exists and belongs to the user
    const existingTour = await prisma.tour.findFirst({
      where: {
        id: params.id,
        creatorId: user.id,
      } as Prisma.TourWhereInput,
    });

    if (!existingTour) {
      return new NextResponse('Tour not found or unauthorized', { status: 404 });
    }

    const body = await request.json();
    console.log('Received update data:', body);

    // Create a clean update object with only defined values
    const updateData: Prisma.TourUpdateInput = {};
    
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.imageUrl) updateData.imageUrl = body.imageUrl;
    if (body.date) updateData.date = new Date(body.date);
    if (body.duration) updateData.duration = parseFloat(body.duration);
    if (body.price) updateData.price = parseFloat(body.price);
    if (body.maxParticipants) updateData.maxParticipants = parseInt(body.maxParticipants);

    console.log('Processed update data:', updateData);

    const updatedTour = await prisma.tour.update({
      where: {
        id: params.id,
      },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookings: true,
        Review: true,
      } as Prisma.TourInclude,
    });

    console.log('Updated tour:', updatedTour);
    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(`Error updating tour: ${errorMessage}`, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First verify the tour exists and belongs to the user
    const existingTour = await prisma.tour.findFirst({
      where: {
        id: params.id,
        creatorId: user.id,
      } as Prisma.TourWhereInput,
    });

    if (!existingTour) {
      return new NextResponse('Tour not found or unauthorized', { status: 404 });
    }

    // Delete the tour and all related records (bookings and reviews will be cascade deleted)
    await prisma.tour.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 