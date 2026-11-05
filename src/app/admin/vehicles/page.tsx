import prisma from '@/lib/db';
import VehiclesManager from '@/components/admin/VehiclesManager';

export const revalidate = 0;

export default async function AdminVehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary font-display">Fleet Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Add, edit, or remove vehicles from public pages. Configure capacities, local/outstation fares, and manage private registration details.
        </p>
      </div>

      <VehiclesManager initialVehicles={vehicles} />
    </div>
  );
}
