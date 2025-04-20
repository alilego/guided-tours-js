'use client';

import { useEffect, useState } from 'react';

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
    <span className="text-gray-700">
      <span className="text-emerald-600 font-medium">{ratingData.averageRating} / 5</span>
      <span className="text-yellow-500 mx-1">★</span>
      <span className="text-gray-500 text-sm">
        ({ratingData.totalReviews} review{ratingData.totalReviews !== 1 ? 's' : ''})
      </span>
    </span>
  );
} 