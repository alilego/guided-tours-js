/**
 * Providers Component
 * Root component that wraps the application with necessary providers.
 * Currently includes:
 * - NextAuth SessionProvider for authentication state management
 */

'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 