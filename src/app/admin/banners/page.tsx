import prisma from '@/lib/db';
import BannersManager from '@/components/admin/BannersManager';

export const revalidate = 0;

export default async function AdminBannersPage() {
  const banners = await prisma.promoBanner.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Promo Banners Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Activate or hide website promotion banners (like festival discounts, airport offers) from the public pages.
        </p>
      </div>

      <BannersManager initialBanners={banners} />
    </div>
  );
}
