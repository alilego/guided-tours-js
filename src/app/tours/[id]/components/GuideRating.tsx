'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GuideRatingProps {
  userId: string;
}

interface RatingData {
  averageRating: number | null;
  totalReviews: number;
}

export default function GuideRating({ userId }: GuideRatingProps) {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/average-rating`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch rating');
        }

        setRatingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rating');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();
  }, [userId]);

  if (isLoading) {
    return <span className="text-gray-500 text-sm">Loading rating...</span>;
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (!ratingData || ratingData.averageRating === null) {
    return <span className="text-gray-500 text-sm">(No reviews yet)</span>;
  }

  return (
    <div className="space-y-2">
      <span className="text-gray-700">
        <span className="text-emerald-600 font-medium">{ratingData.averageRating} / 5</span>
        <span className="text-yellow-500 mx-1">★</span>
        <span className="text-gray-500 text-sm">
          ({ratingData.totalReviews} review{ratingData.totalReviews !== 1 ? 's' : ''})
        </span>
      </span>
      <div>
        <span>Test</span>
        <Link 
          href={`/guides/${userId}/reviews`}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
        >
          View all reviews
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 