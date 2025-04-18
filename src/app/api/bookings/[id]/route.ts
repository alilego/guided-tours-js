import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the booking first to check ownership
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Ensure the user owns this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: params.id,
      },
      include: {
        tour: {
          include: {
            creator: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    // Verify that the booking belongs to the current user
    if (booking.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 