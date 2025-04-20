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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const hideFullyBooked = searchParams.get('hideFullyBooked') === 'true';
    const minDate = searchParams.get('minDate');
    const skip = (page - 1) * limit;

    // First get all tours with their booking counts
    const toursWithBookings = await prisma.tour.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        date: true,
        duration: true,
        maxParticipants: true,
        price: true,
        _count: {
          select: {
            bookings: true
          }
        }
      },
      where: minDate ? {
        date: {
          gte: new Date(minDate)
        }
      } : undefined,
      orderBy: {
        date: 'asc',
      },
    });

    // Filter out fully booked tours if needed
    const filteredTours = hideFullyBooked
      ? toursWithBookings.filter(tour => tour._count.bookings < tour.maxParticipants)
      : toursWithBookings;

    // Apply pagination
    const total = filteredTours.length;
    const paginatedTours = filteredTours.slice(skip, skip + limit);

    // Transform the data to match the expected format
    const formattedTours = paginatedTours.map(tour => ({
      ...tour,
      bookings: new Array(tour._count.bookings), // Create array of undefined with length equal to bookings count
      _count: undefined // Remove the _count field
    }));

    return NextResponse.json({
      tours: formattedTours,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });
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