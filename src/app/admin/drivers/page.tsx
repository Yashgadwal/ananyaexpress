import prisma from '@/lib/db';
import DriversManager from '@/components/admin/DriversManager';

export const revalidate = 0;

export default async function AdminDriversPage() {
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Driver Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Maintain the private drivers directory. Track phone numbers, availability status, driver licenses, and private staff notes.
        </p>
      </div>

      <DriversManager initialDrivers={drivers} />
    </div>
  );
}
