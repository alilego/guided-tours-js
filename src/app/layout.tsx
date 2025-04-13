import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guided Tours',
  description: 'Create and manage guided tours',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.className} bg-white min-h-screen`}>
        <Providers>
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-white">
            {children}
          </main>
        </Providers>
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Steps & Stories. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
