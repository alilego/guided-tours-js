'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GuideProfileProps {
  userId: string;
}

interface ProfileData {
  name: string;
  image: string | null;
  stats: {
    averageRating: number | null;
    totalReviews: number;
    successfulTours: number;
    totalCompletedTours: number;
  };
}

export default function GuideProfile({ userId }: GuideProfileProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/profile`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile');
        }

        setProfileData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>;
  }

  if (error || !profileData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        {profileData.image ? (
          <Image
            src={profileData.image}
            alt={profileData.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 text-xl font-medium">
              {profileData.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
          <div className="mt-1 text-sm text-gray-500">
            {profileData.stats.averageRating ? (
              <span className="flex items-center">
                <span className="text-emerald-600 font-medium">
                  {profileData.stats.averageRating} / 5
                </span>
                <span className="text-yellow-500 mx-1">★</span>
                <span>
                  ({profileData.stats.totalReviews} review{profileData.stats.totalReviews !== 1 ? 's' : ''})
                </span>
              </span>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Tours done so far: 
            &nbsp;
            <span className="mt-1 text-lg font-medium font-semibold text-emerald-600">
                {profileData.stats.successfulTours}
            </span>
          </p>          
        </div>        
      </div>
    </div>
  );
} 