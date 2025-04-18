import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for tour creation
const createTourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  duration: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  date: z.union([z.string(), z.date()]).transform(val => 
    typeof val === 'string' ? new Date(val) : val
  ),
  maxParticipants: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? parseInt(val) : val
  ),
  imageUrl: z.string().min(1, 'Image URL is required'),
});

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        bookings: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has appropriate role
  if (!session?.user?.email || !session.user.role || (session.user.role !== 'ADMIN' && session.user.role !== 'GUIDE')) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin or Guide access required' },
      { status: 403 }
    );
  }

  try {
    const data = await request.json();
    
    // Validate the data
    const validatedData = createTourSchema.parse(data);

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create new tour
    const tour = await prisma.tour.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        duration: validatedData.duration,
        date: validatedData.date,
        maxParticipants: validatedData.maxParticipants,
        imageUrl: validatedData.imageUrl,
        creatorId: user.id,
      },
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
} 