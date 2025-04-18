'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import ConfirmationModal from '@/components/ConfirmationModal';

interface Booking {
  id: string;
  tourId: string;
  tour: {
    id: string;
    title: string;
    imageUrl: string;
    date: string;
    price: number;
    maxParticipants: number;
    bookings: any[];
  };
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleCancelClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    try {
      const response = await fetch(`/api/bookings/${selectedBookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Remove the cancelled booking from the state
      setBookings(bookings.filter(booking => booking.id !== selectedBookingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setSelectedBookingId(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Please sign in to view your bookings</h2>
          <div className="mt-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
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
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p className="text-gray-500">You haven't booked any tours yet.</p>
            <Link
              href="/tours"
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const currentParticipants = booking.tour.bookings.length;

              return (
                <div key={booking.id} className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="relative h-48">
                    <Image
                      src={booking.tour.imageUrl}
                      alt={booking.tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <h3 className="text-xl font-semibold text-gray-900">{booking.tour.title}</h3>
                    <div className="mt-auto">
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          Date: {format(new Date(booking.tour.date), 'MMMM d, yyyy')}
                        </p>
                        <p className="text-emerald-600">Price: €{booking.tour.price}</p>
                        <p className="text-gray-600">
                          Participants: {currentParticipants} out of {booking.tour.maxParticipants}
                        </p>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <Link
                          href={`/tours/${booking.tour.id}`}
                          className="flex-1 rounded-md bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 flex items-center justify-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          className="flex-1 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 flex items-center justify-center"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
      />
    </>
  );
} 