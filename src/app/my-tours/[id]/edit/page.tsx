/**
 * Edit Tour Page
 * Allows tour creators to modify their tour details and delete tours.
 * Route: /my-tours/[id]/edit
 */

'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Tour {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: number;
  date: string;
  maxParticipants: number;
}

export default function EditTourPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    duration: '',
    price: '',
    maxParticipants: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/tours/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update tour');
      }

      router.refresh();
      router.push('/my-tours');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'GUIDE')) {
      router.push('/');
      return;
    }

    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tour');
        }
        const tour = await response.json();
        
        // Format date for datetime-local input
        const formattedDate = new Date(tour.date).toISOString().slice(0, 16);
        
        setFormData({
          title: tour.title,
          description: tour.description,
          imageUrl: tour.imageUrl,
          date: formattedDate,
          duration: tour.duration.toString(),
          price: tour.price.toString(),
          maxParticipants: tour.maxParticipants.toString(),
        });
        setImagePreview(tour.imageUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [params.id, session, status, router]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (hours)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
            Max Participants
          </label>
          <input
            type="number"
            name="maxParticipants"
            id="maxParticipants"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            value={formData.maxParticipants}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
}