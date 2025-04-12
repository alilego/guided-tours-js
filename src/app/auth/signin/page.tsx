'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Guided Tours
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your tours and bookings
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-center text-sm text-red-600">
                {error === 'OAuthSignin' && 'Error starting sign in process'}
                {error === 'OAuthCallback' && 'Error completing sign in'}
                {error === 'OAuthCreateAccount' && 'Error creating account'}
                {error === 'EmailCreateAccount' && 'Error creating account'}
                {error === 'Callback' && 'Error completing sign in'}
                {error === 'OAuthAccountNotLinked' && 'Email already in use with different provider'}
                {error === 'EmailSignin' && 'Error sending sign in link'}
                {error === 'CredentialsSignin' && 'Invalid credentials'}
                {error === 'SessionRequired' && 'Please sign in to access this page'}
                {error === 'Default' && 'An error occurred during sign in'}
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </span>
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          <div className="text-center text-sm text-gray-600">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
} 