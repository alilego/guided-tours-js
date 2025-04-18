/**
 * My Tour Detail Page
 * Shows details of a specific tour for the tour creator.
 * Route: /my-tours/[id]
 */

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function MyTourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || (user.role !== 'ADMIN' && user.role !== 'GUIDE')) {
    redirect('/');
  }

  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    } as Prisma.TourInclude,
  });

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tour not found</h2>
          <p className="mt-2 text-gray-600">The tour you're looking for doesn't exist.</p>
          <Link
            href="/my-tours"
            className="mt-4 inline-block text-emerald-600 hover:text-emerald-700"
          >
            ← Back to My Tours
          </Link>
        </div>
      </div>
    );
  }

  // Verify that the user is the creator of the tour
  if (tour.creator?.id !== user.id && user.role !== 'ADMIN') {
    redirect('/my-tours');
  }

  const formattedDate = format(new Date(tour.date), 'MMMM d, yyyy');

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Featured Image */}
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src={tour.imageUrl}
              alt={tour.title}
              width={800}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Tour details */}
          <div className="mt-6 lg:mt-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {tour.title}
                </h1>
                <div className="mt-3">
                  <h2 className="sr-only">Tour information</h2>
                  <p className="text-3xl tracking-tight text-emerald-600">
                    €{tour.price}
                  </p>
                </div>
              </div>
              <Link
                href={`/my-tours/${tour.id}/edit`}
                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Edit Tour
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-emerald-600 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-gray-700">Duration: {tour.duration} hours</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-emerald-600 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <span className="text-gray-700">Maximum Group Size: {tour.maxParticipants} people</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
          <div 
            className="prose prose-emerald max-w-none text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: tour.description }}
          />
        </div>

        {/* Date and Actions */}
        <div className="mt-10 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-emerald-600 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span className="text-gray-700">Date: {formattedDate}</span>
            </div>

            <Link
              href="/my-tours"
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              ← Back to My Tours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 