import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        tourId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ hasBooked: !!booking });
  } catch (error) {
    console.error('Error checking booking status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 