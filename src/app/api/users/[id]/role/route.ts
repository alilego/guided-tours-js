import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('📥 PATCH /api/users/[id]/role - Request received:', { userId: params.id });
  try {
    const session = await getServerSession(authOptions);
    console.log('🔐 Session state:', { 
      authenticated: !!session, 
      email: session?.user?.email,
      role: session?.user?.role 
    });

    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('❌ Unauthorized role update attempt');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { role } = await request.json();
    console.log('📝 Requested role update:', { userId: params.id, newRole: role });

    if (!['USER', 'GUIDE', 'ADMIN'].includes(role)) {
      console.log('❌ Invalid role requested:', role);
      return new NextResponse('Invalid role', { status: 400 });
    }

    console.log('🔄 Updating user role in database');
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });
    console.log('✅ User role updated successfully:', { 
      userId: updatedUser.id, 
      newRole: updatedUser.role 
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 