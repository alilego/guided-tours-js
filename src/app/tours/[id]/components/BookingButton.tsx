'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface BookingButtonProps {
  tourId: string;
}

export default function BookingButton({ tourId }: BookingButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBooked, setHasBooked] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!session?.user) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/tours/${tourId}/check-booking`);
        if (response.ok) {
          const data = await response.json();
          setHasBooked(data.hasBooked);
        }
      } catch (error) {
        console.error('Error checking booking status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkBookingStatus();
  }, [tourId, session?.user]);

  const handleBooking = async () => {
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    try {
      setIsBooking(true);
      const response = await fetch(`/api/tours/${tourId}/book`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      router.push(`/bookings/success?bookingId=${data.bookingId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to book tour');
    } finally {
      setIsBooking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="text-gray-600 italic">
        Checking booking status...
      </div>
    );
  }

  if (hasBooked) {
    return (
      <div className="text-emerald-600 font-medium flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        You've already booked this tour
      </div>
    );
  }

  return (
    <button
      onClick={handleBooking}
      disabled={isBooking}
      className="rounded-md border border-transparent bg-emerald-600 px-8 py-3 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isBooking ? 'Booking...' : 'Book This Tour'}
    </button>
  );
} 