import prisma from '@/lib/db';
import PackagesManager from '@/components/admin/PackagesManager';

export const revalidate = 0;

export default async function AdminPackagesPage() {
  const packages = await prisma.tourPackage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Tour Package Moderation</h1>
        <p className="text-xs text-gray-500 mt-1">
          Feature or hide tour packages on the public pages. Update starting rates and manage itinerary details.
        </p>
      </div>

      <PackagesManager initialPackages={packages} />
    </div>
  );
}
