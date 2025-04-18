'use client';

import { useState } from 'react';
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