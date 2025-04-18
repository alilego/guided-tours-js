import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('📥 GET /api/users - Request received');
  try {
    const session = await getServerSession(authOptions);
    console.log('🔐 Session state:', { 
      authenticated: !!session, 
      email: session?.user?.email,
      role: session?.user?.role 
    });

    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('🔍 Fetching all users');
    const users = await prisma.user.findMany({
      orderBy: {
        email: 'asc',
      },
    });
    console.log('✅ Found users:', { count: users.length });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('❌ Error in /api/users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 