/**
 * User Role Editor Component
 * A dropdown component for managing user roles in the system.
 * Features:
 * - Role selection between USER, GUIDE, and ADMIN
 * - Immediate role updates via API
 * - Loading state handling
 * - Error handling with role reversion
 */

'use client';

import { useState } from 'react';
import { User } from '@prisma/client';

interface UserRoleEditorProps {
  user: User;
}

export default function UserRoleEditor({ user }: UserRoleEditorProps) {
  const [role, setRole] = useState(user.role);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setRole(newRole);
    } catch (error) {
      console.error('Error updating role:', error);
      // Revert to previous role on error
      setRole(user.role);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={isUpdating}
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6"
    >
      <option value="USER">User</option>
      <option value="GUIDE">Guide</option>
      <option value="ADMIN">Admin</option>
    </select>
  );
} 