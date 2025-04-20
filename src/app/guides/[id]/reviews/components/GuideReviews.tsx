'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  tour: {
    title: string;
  };
  reviewerName: string;
}

interface GuideReviewsProps {
  guideId: string;
}

export default function GuideReviews({ guideId }: GuideReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/guides/${guideId}/reviews`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reviews');
        }

        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [guideId]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading reviews: {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">{'★'.repeat(review.rating)}</span>
                <span className="text-gray-400 text-xl">{'★'.repeat(5 - review.rating)}</span>
                <span className="text-gray-700 font-medium ml-2">{review.rating} out of 5</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Review for <span className="font-medium">{review.tour.title}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMM d, yyyy')}
              </p>
              <p className="text-sm font-medium text-gray-700">
                by {review.reviewerName}
              </p>
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
        </div>
      ))}
    </div>
  );
} 