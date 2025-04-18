'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 sm:flex-row sm:space-y-0">
          <div className="flex space-x-6">
            <Link
              href="/contact"
              className={`${pathname === '/contact' ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'} text-sm`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`${pathname === '/about' ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'} text-sm`}
            >
              About Us
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {currentYear} Steps & Stories. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 