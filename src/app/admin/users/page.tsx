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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users Management</h1>
      <UsersList />
    </div>
  );
} 