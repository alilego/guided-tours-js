'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    // Check if user has admin role
    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-emerald-900">Admin Dashboard</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/users"
                  className="border-transparent text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/admin/tours"
                  className="border-transparent text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tours
                </Link>
                <Link
                  href="/admin/tours/new"
                  className="border-transparent text-emerald-600 hover:border-emerald-300 hover:text-emerald-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Add Tour
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-emerald-600">
                {session.user.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-emerald-50 py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 