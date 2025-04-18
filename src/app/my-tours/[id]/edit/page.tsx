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
import RichTextEditor from '@/components/RichTextEditor';

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
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDescriptionChange = (content: string) => {
    setSuccess(null);
    console.log('🔄 Description changed');
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    console.log('📝 Submitting tour update:', formData);

    try {
      // First, upload the new image if one is selected
      let imageUrl = formData.imageUrl;
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const response = await fetch(`/api/my-tours/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
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

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/my-tours/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tour');
      }

      router.refresh();
      router.push('/my-tours');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tour');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
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
    <div className="max-w-[1400px] mx-auto p-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Image */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tour Image
              </label>
              {(imagePreview || formData.imageUrl) && (
                <div className="relative mb-4">
                  <Image
                    src={imagePreview || formData.imageUrl}
                    alt="Tour preview"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              )}
              <div className="flex flex-col space-y-4">
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Choose New Image
                </button>
                {selectedImage && (
                  <p className="text-sm text-gray-500">
                    Selected: {selectedImage.name}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Or provide an image URL below
                </p>
                <input
                  type="url"
                  name="imageUrl"
                  id="imageUrl"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Right column - Basic Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
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
          </div>
        </div>

        {/* Description field - Full width */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={handleDescriptionChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              Provide a detailed description of the tour, including highlights, what to expect, and any special requirements.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Tour
          </button>
          
          <div className="flex space-x-4">
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
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Tour
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this tour? This action cannot be undone.
              All bookings and reviews associated with this tour will also be deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Tour'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}