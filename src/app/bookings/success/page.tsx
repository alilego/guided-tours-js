'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface BookingDetails {
  id: string;
  tour: {
    id: string;
    title: string;
    imageUrl: string;
    date: string;
    creator: {
      name: string;
      email: string;
    };
  };
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800">Error Loading Booking</h2>
          <p className="mt-2 text-red-600">{error || 'Booking not found'}</p>
          <Link
            href="/my-bookings"
            className="mt-4 inline-block rounded-md bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">Your tour has been successfully booked.</p>
        </div>

        {/* Booking Details Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="relative h-64">
            <Image
              src={booking.tour.imageUrl}
              alt={booking.tour.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900">{booking.tour.title}</h2>
            <div className="mt-4 space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{' '}
                {format(new Date(booking.tour.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Tour Guide:</span>{' '}
                {booking.tour.creator.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Contact Email:</span>{' '}
                {booking.tour.creator.email}
              </p>
            </div>

            {/* Next Steps */}
            <div className="mt-6 rounded-md bg-blue-50 p-4">
              <h3 className="text-lg font-medium text-blue-800">Next Steps</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-blue-700">
                <li>Check your email for detailed tour instructions</li>
                <li>Review meeting point and time details</li>
                <li>Prepare necessary equipment or items for the tour</li>
                <li>Contact the tour guide if you have any questions</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <Link
                href={`/tours/${booking.tour.id}`}
                className="flex-1 rounded-md bg-emerald-100 px-4 py-2 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-200"
              >
                View Tour Details
              </Link>
              <Link
                href="/my-bookings"
                className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 