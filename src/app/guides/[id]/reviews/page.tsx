import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import GuideReviews from './components/GuideReviews';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = await prisma.user.findUnique({
    where: { id: params.id },
    select: { name: true },
  });

  return {
    title: guide ? `Reviews for ${guide.name}` : 'Guide Reviews',
  };
}

export default async function GuideReviewsPage({ params }: PageProps) {
  const guide = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  if (!guide) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {guide.image && (
            <img
              src={guide.image}
              alt={guide.name || 'Guide'}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            Reviews for {guide.name}
          </h1>
        </div>
        
        <GuideReviews guideId={params.id} />
      </div>
    </main>
  );
} 