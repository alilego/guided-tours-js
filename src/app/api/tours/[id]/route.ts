import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { TourUpdateInput } from '@/types/tour';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('📝 PATCH request received for tour:', params.id);
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log('❌ Unauthorized: No session or email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log('👤 User found:', { email: user?.email, role: user?.role });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      console.log('❌ Unauthorized: Invalid role');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
    });
    console.log('🔍 Existing tour found:', tour);

    if (!tour) {
      console.log('❌ Tour not found');
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const data = (await request.json()) as TourUpdateInput;
    console.log('📦 Update data received:', data);

    // Convert string inputs to appropriate types
    const updateData = {
      title: data.title,
      description: data.description,
      duration: data.duration ? parseInt(data.duration.toString()) : undefined,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants.toString()) : undefined,
      date: data.date ? new Date(data.date) : undefined,
      price: data.price,
      imageUrl: data.imageUrl,
    };
    console.log('🔄 Processed update data:', updateData);

    const updatedTour = await prisma.tour.update({
      where: { id: params.id },
      data: updateData,
    });
    console.log('✅ Tour updated successfully:', updatedTour);

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error('❌ Error updating tour:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('🗑️ DELETE request received for tour:', params.id);
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log('❌ Unauthorized: No session or email');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log('👤 User found:', { email: user?.email, role: user?.role });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      console.log('❌ Unauthorized: Invalid role');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
    });
    console.log('🔍 Tour to delete:', tour);

    if (!tour) {
      console.log('❌ Tour not found');
      return new NextResponse('Tour not found', { status: 404 });
    }

    if (tour.creatorId !== user.id) {
      console.log('❌ Unauthorized: User is not the tour creator');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.tour.delete({
      where: { id: params.id },
    });
    console.log('✅ Tour deleted successfully');

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('❌ Error deleting tour:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 