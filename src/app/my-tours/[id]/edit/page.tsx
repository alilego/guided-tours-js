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
import Link from 'next/link';

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
  const [success, setSuccess] = useState<string | null>(null);
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
    setSuccess(null);
    console.log('🔄 Form field changed:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    console.log('📝 Submitting tour update:', formData);

    try {
      const response = await fetch(`/api/my-tours/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error('❌ Failed to update tour:', response.status, response.statusText);
        throw new Error('Failed to update tour');
      }

      console.log('✅ Tour updated successfully');
      setSuccess('Tour updated successfully!');
      router.refresh();
      router.push(`/my-tours/${params.id}`);
    } catch (err) {
      console.error('❌ Error updating tour:', err);
      setError(err instanceof Error ? err.message : 'Failed to update tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    console.log('🔄 Session status:', status);
    console.log('👤 Current session:', session);

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'GUIDE')) {
      console.log('⚠️ Unauthorized access, redirecting to home');
      router.push('/');
      return;
    }

    const fetchTour = async () => {
      try {
        console.log('🔍 Fetching tour details for ID:', params.id);
        const response = await fetch(`/api/my-tours/${params.id}`);
        if (!response.ok) {
          console.error('❌ Failed to fetch tour:', response.status, response.statusText);
          throw new Error('Failed to fetch tour');
        }
        const tour = await response.json();
        console.log('✅ Fetched tour successfully:', tour);
        
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
        console.error('❌ Error fetching tour:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [params.id, session, status, router]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Tour</h1>
        <Link
          href={`/my-tours/${params.id}`}
          className="text-sm text-emerald-600 hover:text-emerald-700"
        >
          View Tour
        </Link>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              required
              rows={6}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              name="date"
              id="date"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

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
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={formData.maxParticipants}
              onChange={handleChange}
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Image
              </label>
              <Image
                src={imagePreview}
                alt="Tour preview"
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Link
            href="/my-tours"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}