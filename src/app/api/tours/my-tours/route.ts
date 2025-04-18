export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  console.log('📥 GET /api/tours/my-tours - Request received');
  try {
    const session = await getServerSession(authOptions);
    console.log('🔐 Session state:', { 
      authenticated: !!session, 
      email: session?.user?.email 
    });

    if (!session?.user?.email) {
      console.log('❌ Unauthorized - No session or email');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log('👤 User found:', { 
      id: user?.id, 
      email: user?.email, 
      role: user?.role 
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
      console.log('❌ Unauthorized - Invalid role:', user?.role);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('🔍 Fetching tours for user:', user.id);
    const tours = await prisma.tour.findMany({
      where: {
        creatorId: user.id
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        creator: true
      }
    });
    console.log('✅ Found tours:', { count: tours.length });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('❌ Error in /api/tours/my-tours:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 