/**
 * My Tours Page
 * Displays all tours created by the logged-in user (ADMIN or GUIDE).
 * Features include viewing and managing created tours.
 * Route: /my-tours
 */

export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { authOptions } from '../api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface Tour {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: number;
  date: string;
  maxParticipants: number;
  createdAt: string;
}

export default async function MyToursPage() {
  console.log('🎯 Rendering MyToursPage');
  const session = await getServerSession(authOptions);
  console.log('🔐 Session state:', { 
    authenticated: !!session, 
    email: session?.user?.email 
  });

  if (!session?.user?.email) {
    console.log('❌ No session - redirecting to home');
    redirect('/');
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
    console.log('❌ Unauthorized role - redirecting to home');
    redirect('/');
  }

  console.log('🔍 Fetching tours for user:', user.id);
  const tours = await prisma.tour.findMany({
    where: {
      creatorId: user.id
    } as Prisma.TourWhereInput,
    orderBy: {
      createdAt: 'desc',
    },
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
  console.log('✅ Found tours:', { count: tours.length });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Tours</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all tours you have created.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/my-tours/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Tour
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {tours.map((tour) => (
            <div key={tour.id} className="group relative flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/my-tours/${tour.id}`} className="flex-grow">
                <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  <Image
                    src={tour.imageUrl}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:opacity-75"
                    priority={false}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {tour.title}
                    </h3>
                    <p className="text-sm font-medium text-emerald-600">€{tour.price}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {format(new Date(tour.date), 'MMMM d, yyyy')}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-1 h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {tour.duration} hours
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-1 h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                      Max {tour.maxParticipants}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-4 pt-0 mt-auto">
                <div className="flex justify-end">
                  <Link
                    href={`/my-tours/${tour.id}/edit`}
                    className="text-emerald-600 hover:text-emerald-900 text-sm font-medium"
                  >
                    Edit Tour
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 