/**
 * Tours List Page
 * Displays all available tours with filtering and sorting options.
 * Route: /tours
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface Tour {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  duration: number;
  maxParticipants: number;
  price: number;
  bookings: any[];
}

export default function ToursListPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        setTours(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading tours</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Available Tours</h1>
            <p className="mt-2 text-sm text-gray-700">
              Browse our selection of guided tours and find the perfect adventure for you.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {tours.map((tour) => {
            const currentParticipants = tour.bookings?.length || 0;
            const isFullyBooked = currentParticipants >= tour.maxParticipants;

            return (
              <div key={tour.id} className="group relative flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/tours/${tour.id}`} className="flex-grow">
                  <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    <Image
                      src={tour.imageUrl}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:opacity-75"
                      priority={false}
                    />
                    {isFullyBooked && (
                      <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-sm font-medium text-white">
                        Fully Booked
                      </div>
                    )}
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
                        {currentParticipants} / {tour.maxParticipants}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 