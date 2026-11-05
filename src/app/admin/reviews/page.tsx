import prisma from '@/lib/db';
import ReviewsManager from '@/components/admin/ReviewsManager';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Review Moderation</h1>
        <p className="text-xs text-gray-500 mt-1">
          Approve or reject customer reviews submitted online. Set featured status to display reviews on the public homepage.
        </p>
      </div>

      <ReviewsManager initialReviews={reviews} />
    </div>
  );
}
