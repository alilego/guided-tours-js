import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Steps & Stories',
  description: 'Create and manage guided tours',
  openGraph: {
    title: 'Steps & Stories - Local Guided Tours in Romania',
    description: 'Experience authentic local culture, unforgettable history and adventures with our carefully curated tours and expert local guides.',
    url: 'https://tours.vladiverse.com',
    siteName: 'Steps & Stories',
    images: [
      {
        url: '/parliament-guided-tour-sunset.png',
        width: 2070,
        height: 1380,
        alt: 'Palace of Parliament in Bucharest',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steps & Stories - Local Guided Tours in Romania',
    description: 'Experience authentic local culture, unforgettable history and adventures with our carefully curated tours and expert local guides.',
    images: ['/parliament-guided-tour-sunset.png'],
  },
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
