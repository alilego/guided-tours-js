/**
 * Admin Users List Page
 * Displays a list of all users in the system and allows admins to manage user roles.
 * Route: /admin/users
 */

'use client';

import UsersList from '@/components/admin/UsersList';

export const dynamic = 'force-dynamic';

export default function AdminUsersListPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users Management</h1>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users in the system and their assigned roles.
          </p>
        </div>
      </div>
      <UsersList />
    </div>
  );
} 