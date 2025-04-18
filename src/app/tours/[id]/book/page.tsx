/**
 * Tour Booking Page
 * Allows users to book a specific tour.
 * Route: /tours/[id]/book
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Tour {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: number;
  date: string;
  maxParticipants: number;
  bookings: any[];
}

export default function BookTourPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tour details');
        }
        const data = await response.json();
        setTour(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (!tour) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          participants: 1, // Each booking represents one spot
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      router.push(`/bookings/success?tourId=${tour.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading tour</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableSpots = tour.maxParticipants - (tour.bookings?.length || 0);
  const formattedDate = format(new Date(tour.date), 'MMMM d, yyyy');

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Tour Summary */}
          <div className="lg:max-w-lg">
            <Link
              href={`/tours/${tour.id}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              ← Back to Tour Details
            </Link>
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Book {tour.title}
              </h1>
              <div className="mt-4">
                <Image
                  src={tour.imageUrl}
                  alt={tour.title}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-lg text-emerald-600 font-medium">€{tour.price}</p>
                <p className="text-gray-700">Date: {formattedDate}</p>
                <p className="text-gray-700">Duration: {tour.duration} hours</p>
                <p className="text-gray-700">Available spots: {availableSpots}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!session?.user ? (
                <div className="mt-6">
                  <p className="text-gray-700 mb-4">Please sign in to book this tour.</p>
                  <Link
                    href="/auth/signin"
                    className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Sign In
                  </Link>
                </div>
              ) : availableSpots > 0 ? (
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>€{tour.price}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Book one spot on this tour</p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-md border border-transparent bg-emerald-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <p className="text-red-600">Sorry, this tour is fully booked.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 