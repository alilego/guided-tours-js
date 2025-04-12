'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function UpdateRolePage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const updateRole = async () => {
    if (!session?.user?.email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: session.user.email,
          name: session.user.name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Role updated successfully! Please sign out and sign back in to see the changes.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to update role');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while updating the role');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update User Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Current email: {session.user?.email}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={updateRole}
            disabled={status === 'loading'}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              status === 'loading'
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {status === 'loading' ? 'Updating...' : 'Update to Admin Role'}
          </button>

          {message && (
            <p
              className={`mt-2 text-center text-sm ${
                status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 